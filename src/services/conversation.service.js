require("dotenv").config()
const Conversation = require('../models/conversation.model');
const ConversationModel = require('../models/conversation.model');
const MessageModel = require('../models/message.model');
const User = require('../models/user.model');
const checkUserId = require('../utils/checkUserId');
const { s3 } = require("../configs/aws.config")

const getConversationsService = async (senderId) => {
    try {
        const resConversations = []
        const conversations = await Conversation.scan().exec();
    
        // Lọc các cuộc trò chuyện mà senderId tham gia
        const conversationsOfSender = conversations.filter((conversation) =>
            conversation.participantIds.some(participant => participant.participantId === senderId)
        );
    
        const memberIds = conversationsOfSender.reduce((acc, conversation) => {
            acc.push(...conversation.participantIds.map(participant => participant.participantId));
            return acc;
        }, []);
    
        // Sử dụng Set để loại bỏ các phần tử trùng lặp
        const uniqueMemberIds = [...new Set(memberIds)];
    
        // Lấy thông tin của tất cả các thành viên một lần bằng cách sử dụng batchGet
        const members = await User.batchGet(uniqueMemberIds, {
            attributes: ['userID', 'fullName', 'profilePic'],
        });
    
        // Tạo một đối tượng để lưu trữ thông tin của người dùng
        const membersMap = {};
        members.forEach((member) => {
            membersMap[member.userID] = member;
        });
    
        // Kết hợp thông tin của thành viên vào mỗi cuộc trò chuyện
        const conversationsWithMembers = conversationsOfSender.map((conversation) => {
            let membersInfo = conversation.participantIds.map(
                (participant) => membersMap[participant.participantId]
            );
             // Sắp xếp membersInfo theo vai trò của participantId trong conversation.participantIds
            membersInfo.sort((a, b) => {
                let roleA = conversation.participantIds.find((participant) => participant.participantId === a.userID)?.role?.toLowerCase();
                let roleB = conversation.participantIds.find((participant) => participant.participantId === b.userID)?.role?.toLowerCase();
                // console.log({roleA, roleB})
                if (roleA < roleB) {
                    return 1;
                }
                if (roleA > roleB) {
                    return -1;
                }
                return 0;
            });

            return { ...conversation, membersInfo };
        });
    
        for(const conversationsWithMember of conversationsWithMembers){
            const lastMessage = await getLastMessageService(senderId, {conversationId: conversationsWithMember.conversationId})
            resConversations.push({...conversationsWithMember, lastMessage: lastMessage.data})
        }
    
        resConversations.sort((a, b) => {
            const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(a.createdAt);
            const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(b.createdAt);
            return dateB - dateA;
        });
    
        return {
            data: resConversations,
            status: 200
        }
    } catch (error) {
        console.log(error)
    }
}

const createConversationService = async (userID, data, avatar) => {
    const { name, participantIds } = data;
    let conversationAvatar = "";
    let conversationName = "";
    let conversationParticipants = [];

    // Kiểm tra xem số lượng participantIds phải là ít nhất 2
    if (participantIds.length < 2) {
        return {
            message: 'Cuộc trò chuyện phải có ít nhất 2 người tham gia.',
            status: 400,
            data: {}
        };
    }

    // Kiểm tra xem cuộc trò chuyện đã tồn tại giữa các participantIds
    const existingConversation = await ConversationModel.scan().exec();

    const matchingConversations = existingConversation.filter(
        (conversation) => {
            return participantIds.every((id) =>
                conversation.participantIds.some(participant => participant.participantId === id)
            );
        }
    );

    if (matchingConversations.length > 0) {
        return {
            message: 'Cuộc trò chuyện đã tồn tại',
            status: 200,
            data: matchingConversations[0],
        };
    }

    // Kiểm tra xem tất cả các id trong participantIds có hợp lệ không
    const isValidParticipants = await Promise.all(
        participantIds.map(async (id) => {
            const isValid = await checkUserId(id);
            return isValid;
        })
    );

    // Nếu có bất kỳ id nào không hợp lệ, trả về lỗi
    if (isValidParticipants.includes(false)) {
        return {
            message: 'Tồn tại người dùng không hợp lệ',
            status: 400,
            data: {}
        };
    }

    if(participantIds.length === 2){
        conversationParticipants = participantIds.map(participantId => {
            return {participantId, role: "member"}
        })
    }

    if(participantIds.length > 2){
        conversationName = name;
        conversationParticipants = participantIds.map(participantId => {
            return {participantId, role: participantId === userID ? "owner" : "member"}
        })

        const image = avatar.originalname.split('.');
        const fileType = image[image.length - 1];
        const filePath = `avt_${Date.now().toString()}.${fileType}`;

        const paramsS3 = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filePath,
            Body: avatar.buffer,
            ContentType: 'image/png',
            ContentDisposition: 'inline',
        };

        const data = await s3.upload(paramsS3).promise();
        conversationAvatar = data.Location;
    }

    // Tạo một cuộc hội thoại mới và lưu
    let conversation = new ConversationModel({
        avatar: conversationAvatar,
        name: conversationName,
        participantIds: conversationParticipants, // Thay đổi ở đây để truy cập vào trường participantId trong mỗi object
    });
    conversation = await conversation.save();

    return {
        message: 'Tạo cuộc hội thoại thành công',
        status: 201,
        data: conversation,
    };
}

const getLastMessageService = async (userID, data) => {
    const { conversationId } = data;

	// Lấy danh sách tin nhắn của cuộc trò chuyện
	const messages = await MessageModel.query('conversationId')
        .eq(conversationId)
        .exec();

    if(messages && messages.length > 0){
        const filterMessages = messages.filter(message => {
            return !message.deletedUserIds?.includes(userID)
        })
    
        const messageArray = filterMessages.map((message) => message.toJSON());
    
        // Sắp xếp mảng tin nhắn theo createdAt
        messageArray.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
    
        let lastMessage = messageArray[messageArray.length - 1]
    
        const sender = await User.query('userID')
        .eq(lastMessage.senderId)
        .exec();
    
        lastMessage = {...lastMessage, senderName: sender[0].fullName}
    
        return {
            message: 'Lấy last message thành công',
            data: lastMessage,
            status: 200
        };
    }

    return {
        message: 'Cuộc trò chuyện chưa có tin nhắn',
        data: null,
        status: 200
    };
}

const getRecentlyConversationsService = async (userID, data) => {
    const { quantity } = data;

    const conversations = await getConversationsService(userID)

    const recentlyConversations = conversations?.data.slice(0, quantity)

    return {
		message: 'Lấy các conversation gần đây thành công',
        data: recentlyConversations,
        status: 200
    };
}

const getRecentlyFriendConversationsService = async (userID, data) => {
    const { quantity } = data;
    const user = await User.query('userID')
    .eq(userID)
    .exec();

    const conversations = await getConversationsService(userID)

    const conversationsWithFriend = [];
    for (const conversation of conversations.data) {
        if(conversation.participantIds.length === 2){
            const anotherParticipantId = conversation.participantIds.find(participantId => {
                return participantId.participantId !== userID;
            });
            const isFriend = user[0].friends.includes(anotherParticipantId.participantId);
            if (isFriend) {
                conversationsWithFriend.push({...conversation, anotherParticipantId: anotherParticipantId.participantId});
            }
        }
    }

    const recentlyFriendConversations = conversationsWithFriend.slice(0, quantity)

    return {
		message: 'Lấy các conversation gần đây thành công',
        data: recentlyFriendConversations,
        status: 200
    };
}

module.exports = {
    getConversationsService,
    createConversationService,
	getLastMessageService,
    getRecentlyConversationsService,
    getRecentlyFriendConversationsService
}