require("dotenv").config()
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/user.model');
const ContactModel = require('../models/contact.model');
const ConversationModel = require('../models/conversation.model');
const { s3 } = require("../configs/aws.config")
const { io, getReceiverSocketId } = require('../socket/socket');
const MessageModel = require('../models/message.model');


const addContactForUserService = async (userId, data) => {
    const { contactName, phoneNumber } = data;

    // Kiểm tra liên hệ này có trong danh bạ hay chưa
    const existingContacts = await ContactModel.query('userID')
        .eq(userId)
        .where('phoneNumber')
        .eq(phoneNumber)
        .exec();

    if (existingContacts && existingContacts.length > 0) {
        return {
            message: 'Liên lạc đã tồn tại trong danh bạ.',
            status: 400,
            data: {}
        };
    }

    // Kiểm tra xem có người dùng nào có phoneNumber đó hay không
    const userWithPhoneNumber = await UserModel.query('phoneNumber')
        .eq(phoneNumber)
        .exec();

    if (!userWithPhoneNumber || userWithPhoneNumber.length === 0) {
        return {
            message: 'Nguời dùng không tồn tại',
            status: 404,
            data: {}
        };
    }

    // Tạo liên hệ mới
    const newContact = new ContactModel({
        userID: userId,
        contactName: contactName,
        phoneNumber: phoneNumber,
    });
    await newContact.save();

    return {
        message: 'Liên lạc đã được thêm vào danh bạ.',
        status: 201,
        data: newContact,
    };
}

const getAllContactOfUserService = async (userId) => {
    const contacts = await ContactModel.query('userID').eq(userId).exec();
    return {
        message: 'Lấy thành công danh sách liên hệ của người dùng',
        status: 200,
        data: contacts,
    };
}

const findUserByPhoneNumberService = async (user, data) => {
    const { userID } = user;
    const { phoneNumber } = data;
    const users = await UserModel.scan('phoneNumber')
        .contains(phoneNumber.trim())
        .filter((user) => user.userID !== userID)
        .attributes(['userID', 'phoneNumber', 'fullName', 'profilePic', 'friends'])
        .exec();

    return {
        message: 'Tìm thành công',
        status: 200,
        data: users,
    };
}

const updateProfilePicService = async (user, file) => {
    const { userID } = user;

    const image = file.originalname.split('.');
    const fileType = image[image.length - 1];
    const filePath = `avt_${Date.now().toString()}.${fileType}`;

    const paramsS3 = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filePath,
        Body: file.buffer,
        ContentType: 'image/png',
        ContentDisposition: 'inline',
    };

    // Tải ảnh lên S3
    const data = await s3.upload(paramsS3).promise();
    const profilePic = data.Location;

    // Cập nhật avatar người dùng
    await UserModel.update({ userID }, { profilePic });

    // Lấy thông tin người dùng sau khi cập nhật
    const updatedUser = await UserModel.scan('userID')
        .eq(userID)
        .attributes([
            'userID',
            'gender',
            'phoneNumber',
            'fullName',
            'dateOfBirth',
            'profilePic',
        ])
        .exec();

    return {
        message: 'Cập nhật thông tin thành công',
        status: 200,
        data: updatedUser,
    };
}

const changePasswordService = async ({ phoneNumber, newPassword }) => {
    const user = await UserModel.query('phoneNumber').eq(phoneNumber).exec();

    // 2. Kiểm tra nếu người dùng tồn tại
    if (user && user.length > 0) {
        // 3. Thực hiện cập nhật mật khẩu cho người dùng
        const updatedUser = await UserModel.update({ userID: user[0].userID }, { password: newPassword });
        
        // 4. Trả về kết quả cho người dùng
        return {
            message: 'Thay đổi mật khẩu thành công',
            status: 200,
            data: updatedUser,
        };
    } else {
        return {
            message: 'Không tìm thấy người dùng với số điện thoại đã cho',
            status: 404,
            data: {},
        };
    }
};

const updateUserInfoService = async (user, data) => {
    const { userID } = user;
    const {fullName, dateOfBirth, gender} = data

    // Cập nhật thông tin người dùng
    await UserModel.update({ userID }, { fullName, dateOfBirth, gender });


    // Lấy thông tin người dùng sau khi cập nhật
    const updatedUser = await UserModel.scan('userID')
        .eq(userID)
        .attributes([
            'userID',
            'gender',
            'phoneNumber',
            'fullName',
            'dateOfBirth',
            'profilePic',
        ])
        .exec();

    return {
        message: 'Cập nhật thông tin thành công',
        status: 200,
        data: updatedUser,
    };
}

const updateUserPasswordService = async (user, data) => {
    const { userID } = user;
    const {currentPassword, newPassword} = data

    const currentUser = await UserModel.query('userID').eq(userID).exec();

    if(currentUser && currentUser.length > 0) {

        const hashedPassword = currentUser[0].password;

        const isCorrectPassword = await bcrypt.compare(
            currentPassword,
            hashedPassword
        );

        if(isCorrectPassword) {
            // Cập nhật mật khẩu người dùng
            await UserModel.update({ userID }, { password: newPassword });
    
            // Lấy thông tin người dùng sau khi cập nhật
            const updatedUser = await UserModel.scan('userID')
                .eq(userID)
                .attributes([
                    'userID',
                    'gender',
                    'phoneNumber',
                    'fullName',
                    'dateOfBirth',
                    'profilePic',
                ])
                .exec();
    
            return {
                message: 'Cập nhật mật khẩu thành công',
                status: 200,
                data: updatedUser,
            };
        }

        return {
            message: 'Mật khẩu hiện tại không chính xác',
            status: 400,
            data: {},
        };
    }

    return {
        message: 'Nguời dùng không tồn tại',
        status: 404,
        data: {},
    };
}

const addFriendService = async (data) => {
    const { userId, friendId } = data;

    try {
        // Lấy thông tin người dùng hiện tại
        const currentUser = await UserModel.get(userId);

        // Kiểm tra nếu người dùng đã có bạn bè
        const friends = currentUser.friends || [];

        // Kiểm tra xem friendId đã tồn tại trong danh sách bạn bè chưa
        if (!friends.includes(friendId)) {
            // Thêm friendId vào mảng bạn bè của người dùng
            friends.push(friendId);

            // Cập nhật mảng bạn bè mới vào người dùng
            await UserModel.update({ userID: userId }, { friends });

               //Cập nhật mảng bạn bè mới vào người dùng friendId
            const friendUser = await UserModel.get(friendId);
        
            const friendsOfFriend = friendUser.friends || [];
            friendsOfFriend.push(userId);
            await UserModel.update({ userID: friendId }, { friends: friendsOfFriend });
            
            //Xóa khỏi danh sách lời mời kết bạn của người user
            const listRequestAddFriendsReceived = currentUser.listRequestAddFriendsReceived || [];
            const updatedListRequestAddFriendsReceived = listRequestAddFriendsReceived.filter((id) => id !== friendId);
            await UserModel.update({ userID: userId }, { listRequestAddFriendsReceived: updatedListRequestAddFriendsReceived });

            // //xóa khỏi danh sách đã gửi của người gửi
            const listRequestAddFriendsSent = friendUser.listRequestAddFriendsSent || [];
            const updatedListRequestAddFriendsSent = listRequestAddFriendsSent.filter((id) => id !== userId);
            await UserModel.update({ userID: friendId }, { listRequestAddFriendsSent: updatedListRequestAddFriendsSent });

            // Kiểm tra xem có tồn tại cuộc trò chuyện nào giữa 2 user không
            const existingConversation = await ConversationModel.scan().exec();
            const matchingConversations = existingConversation.filter(
                (conversation) => {
                    const participantIds = conversation.participantIds.map(participant => participant.participantId);
                    return participantIds.includes(userId) && participantIds.includes(friendId);
                }
            );

            let conversation;
            let membersInfo;

            if (matchingConversations.length > 0) {
                // Cuộc trò chuyện đã tồn tại
                conversation = matchingConversations[0];

                // Lấy thông tin về các thành viên trong cuộc trò chuyện đã tồn tại
                const memberIds = conversation.participantIds.map(participant => participant.participantId);
                const members = await UserModel.batchGet(memberIds, {
                    attributes: ['userID', 'fullName', 'profilePic'],
                });

                const membersMap = {};
                members.forEach((member) => {
                    membersMap[member.userID] = member;
                });

                membersInfo = conversation.participantIds.map(participant => membersMap[participant.participantId]);
                conversation.membersInfo = membersInfo;
            } else {
                // Tạo cuộc trò chuyện mới
                const conversationParticipants = [
                    { participantId: userId, role: 'member' },
                    { participantId: friendId, role: 'member' }
                ];

                conversation = new ConversationModel({
                    avatar: '',
                    name: '',
                    participantIds: conversationParticipants
                });
                conversation = await conversation.save();

                // Lấy thông tin của tất cả các thành viên và thêm vào cuộc trò chuyện
                const memberIds = conversationParticipants.map(participant => participant.participantId);
                const members = await UserModel.batchGet(memberIds, {
                    attributes: ['userID', 'fullName', 'profilePic'],
                });

                const membersMap = {};
                members.forEach((member) => {
                    membersMap[member.userID] = member;
                });

                membersInfo = conversationParticipants.map(participant => membersMap[participant.participantId]);
                conversation.membersInfo = membersInfo;
            }

            const message = new MessageModel({
                senderId: userId,
                conversationId: conversation.conversationId,
                content: "đã đồng ý lời mời kết bạn",
                type: "notification"
            })
    
            const savedMessage = await message.save()

            const receiverSocketId = getReceiverSocketId(friendId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('updateConversationAfterAcceptingAddFriend', {conversation, savedMessage});
                io.to(receiverSocketId).emit('acceptAddFriend', userId);
            }

            return {
                message: 'Thêm bạn thành công',
                status: 200,
                data: {acceptedFriend: friendId, conversation},
            };
        } else {
            return {
                message: 'Người dùng đã là bạn bè của nhau',
                status: 400,
                data: {},
            };
        }
    } catch (error) {
        console.error('Error adding friend:', error);
        return {
            message: 'Có lỗi xảy ra khi thêm bạn',
            status: 500,
            data: {},
        };
    }
}

const requestAddFriendsSent = async (data) => {
    try {
        const { userId, friendId } = data;
        console.log('userId:', userId);
        console.log('friendId:', friendId);

        // 1. Lấy thông tin người dùng gửi lời mời kết bạn
        const currentUser = await UserModel.get(userId);
        console.log('currentUser:', currentUser);

        // 2. Thêm friendId vào mảng listRequestAddFriendsSent của người dùng gửi lời mời kết bạn
        const listRequestAddFriendsSent = currentUser.listRequestAddFriendsSent || [];
        if (!listRequestAddFriendsSent.includes(friendId)) {
            listRequestAddFriendsSent.push(friendId);
            await UserModel.update({ userID: userId }, { listRequestAddFriendsSent });
        }

        // 3. Thêm userId vào mảng listRequestAddFriendsReceived của người dùng nhận lời mời kết bạn
        const friendUser = await UserModel.get(friendId);
        console.log('friendUser:', friendUser);
        const listRequestAddFriendsReceived = friendUser.listRequestAddFriendsReceived || [];
        if (!listRequestAddFriendsReceived.includes(userId)) {
            listRequestAddFriendsReceived.push(userId);
            await UserModel.update({ userID: friendId }, { listRequestAddFriendsReceived });
        }

        const receiverSocketId = getReceiverSocketId(friendId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('addFriend', userId);
        }

        return {
            message: 'Lời mời kết bạn đã được gửi',
            status: 200,
            data: {},
        };
    } catch (error) {
        console.error('Error sending friend request:', error);
        return {
            message: 'Có lỗi xảy ra khi gửi lời mời kết bạn',
            status: 500,
            data: {},
        };
    }
}

const getAllInFoUser = async (userId) => {
    const user = await UserModel.get(userId);
    return {
        message: 'Lấy thông tin người dùng thành công',
        status: 200,
        data: user,
    };
}

const getUserById = async (userId) => {
    const user = await UserModel.get(userId);
    return {
        message: 'Lấy thông tin người dùng thành công',
        status: 200,
        data: user,
    };
}

const cancelAddFriends = async (data) => {
    try {
        const { userId, friendId } = data;
        
        const currentUser = await UserModel.get(userId);   
        const listRequestAddFriendsSent = currentUser.listRequestAddFriendsSent || [];
        const updatedListRequestAddFriendsSent = listRequestAddFriendsSent.filter((id) => id !== friendId);
        await UserModel.update({ userID: userId }, { listRequestAddFriendsSent: updatedListRequestAddFriendsSent });
       
        const friendUser = await UserModel.get(friendId);
        const listRequestAddFriendsReceived = friendUser.listRequestAddFriendsReceived || [];
        const updatedListRequestAddFriendsReceived = listRequestAddFriendsReceived.filter((id) => id !== userId);
        await UserModel.update({ userID: friendId }, { listRequestAddFriendsReceived: updatedListRequestAddFriendsReceived });

        const receiverSocketId = getReceiverSocketId(friendId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('cancelAddFriend', userId);
        }

        return {
            message: 'Hủy lời mời kết bạn thành công',
            status: 200,
            data: friendId,
        };
    } catch (error) {
        console.error('Error canceling friend request:', error);
        return {
            message: 'Có lỗi xảy ra khi hủy lời mời kết bạn',
            status: 500,
            data: {},
        };
    }
}

const cancelRequestAddFriendsService = async (data) =>{
    console.log("Server called")
    try {
        const { userId, userRequestedId } = data;
        console.log(data)
    
        const currentUser = await UserModel.get(userId);   
        const listRequestAddFriendsReceived = currentUser.listRequestAddFriendsReceived || [];
        const updatedListRequestAddFriendsReceived = listRequestAddFriendsReceived.filter((id) => id !== userRequestedId);
        await UserModel.update({ userID: userId }, { listRequestAddFriendsReceived: updatedListRequestAddFriendsReceived });

        const userRequested = await UserModel.get(userRequestedId);
        const listRequestAddFriendsSent = userRequested.listRequestAddFriendsSent || [];
        const updatedListRequestAddFriendsSent = listRequestAddFriendsSent.filter((id) => id !== userId);
        await UserModel.update({ userID: userRequestedId }, { listRequestAddFriendsSent: updatedListRequestAddFriendsSent });

        const receiverSocketId = getReceiverSocketId(userRequestedId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('refuseAddFriend', userId);
        }
      
        return {
            message: 'Từ chối lời mời yêu cầu kết bạn thành công',
            status: 200,
            data: userRequestedId,
        };
    } catch (error) {
        console.error('Error canceling friend request:', error);
        return {
            message: 'Có lỗi xảy ra khi hủy lời mời kết bạn',
            status: 500,
            data: {},
        };  
    }

     
}

const deleteFriendService = async (data) => {
    const { userId, friendId } = data;

    try {
        // Lấy thông tin người dùng hiện tại
        const currentUser = await UserModel.get(userId);

        // Kiểm tra nếu người dùng đã có bạn bè
        const friends = currentUser.friends || [];

        // Kiểm tra xem friendId đã tồn tại trong danh sách bạn bè chưa
        if (friends.includes(friendId)) {
            // Xóa friendId khỏi mảng bạn bè của người dùng
            const updatedFriends = friends.filter((id) => id !== friendId);

            // Cập nhật mảng bạn bè mới vào người dùng
            await UserModel.update({ userID: userId }, { friends: updatedFriends });

            //Xóa khỏi danh sách bạn bè của friendId
            const friendUser = await UserModel.get(friendId);
            const friendsOfFriend = friendUser.friends || [];
            const updatedFriendsOfFriend = friendsOfFriend.filter((id) => id !== userId);
            await UserModel.update({ userID: friendId }, { friends: updatedFriendsOfFriend });

            const receiverSocketId = getReceiverSocketId(friendId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('deleteFriend', userId);
            }

            return {
                message: 'Xóa bạn thành công',
                status: 200,
                data: friendId, // Trả về danh sách bạn bè mới
            };
        } else {
            return {
                message: 'Người dùng không phải là bạn bè của nhau',
                status: 400,
                data: {},
            };
        }
    } catch (error) {
        console.error('Error deleting friend:', error);
        return {
            message: 'Có lỗi xảy ra khi xóa bạn',
            status: 500,
            data: {},
        };
    }
}

const getAllFriendsWithConversationIdService = async (user) => {
    let friends = []
    for(const friend of user.friends) {
        const friendInfo = await UserModel.scan('userID')
            .eq(friend)
            .attributes([
                'userID',
                'gender',
                'phoneNumber',
                'fullName',
                'dateOfBirth',
                'profilePic',
            ])
            .exec();

        const conversations = await ConversationModel.scan().exec();

        const conversationsOfUserAndFriend = conversations.find((conversation) =>
            conversation.participantIds.length = 2
            && conversation.participantIds.some(participant => participant.participantId === user.userID)
            && conversation.participantIds.some(participant => participant.participantId === friend)
        );
        
        friends.push({...friendInfo[0], conversationId: conversationsOfUserAndFriend.conversationId})
    }

    friends.sort(
        (a, b) => {
            let x = a.fullName.toLowerCase();
            let y = b.fullName.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        }
    );

    return {
		message: 'Lấy tất cả friends thành công',
        data: friends,
        status: 200
    };
}

const findUsersByIdsService = async (data) => {
    let { userIds } = data;
    if (typeof userIds === 'string') {
        userIds = [userIds];
    }
    
    const users = await UserModel.batchGet(userIds, {
        attributes: ['userID', 'phoneNumber', 'fullName', 'profilePic', 'friends']
    })

    return {
        message: 'Tìm thành công',
        status: 200,
        data: users,
    };
}


module.exports = {
    addContactForUserService,
    getAllContactOfUserService,
    findUserByPhoneNumberService,
    updateProfilePicService,
    changePasswordService,
    updateUserInfoService,
    updateUserPasswordService,
    addFriendService,
    requestAddFriendsSent,
    getAllInFoUser,
    getUserById,
    cancelAddFriends,
    deleteFriendService,
    cancelRequestAddFriendsService,
    getAllFriendsWithConversationIdService,
    findUsersByIdsService
}