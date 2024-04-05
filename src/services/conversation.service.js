const Conversation = require('../models/conversation.model');
const ConversationModel = require('../models/conversation.model');
const MessageModel = require('../models/message.model');
const User = require('../models/user.model');
const checkUserId = require('../utils/checkUserId');

const getConversationsService = async (senderId) => {
    const conversations = await Conversation.scan().exec();

    // Lọc các cuộc trò chuyện mà senderId tham gia
    const conversationsOfSender = conversations.filter((conversation) =>
        conversation.participantIds.includes(senderId)
    );

    const memberIds = conversationsOfSender.reduce((acc, conversation) => {
        acc.push(...conversation.participantIds);
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
        const membersInfo = conversation.participantIds.map(
            (memberId) => membersMap[memberId]
        );
        return { ...conversation, membersInfo };
    });

    return {
        data: conversationsWithMembers,
        status: 200
    }
}

const createConversationService = async (data) => {
    const { name, participantIds } = data;

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
					conversation.participantIds.includes(id)
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

		// Tạo một cuộc hội thoại mới và lưu
		let conversation = new ConversationModel({
			name: name,
			participantIds: participantIds,
			lastMessage: '',
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

module.exports = {
    getConversationsService,
    createConversationService,
	getLastMessageService
}