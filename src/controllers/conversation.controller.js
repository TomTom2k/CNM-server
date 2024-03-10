const checkUserId = require('../utils/checkUserId');
const ConversationModel = require('../models/conversation.model');
const Conversation = require('../models/conversation.model');
const User = require('../models/user.model');

const getConversations = async (req, res, next) => {
	try {
		const senderId = req.user.userID;
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
		const conversationsWithMembers = conversations.map((conversation) => {
			const membersInfo = conversation.participantIds.map(
				(memberId) => membersMap[memberId]
			);
			return { ...conversation, membersInfo };
		});

		res.status(200).json({ conversations: conversationsWithMembers });
	} catch (error) {
		next(error);
	}
};

const createConversation = async (req, res, next) => {
	try {
		const { name, participantIds } = req.body;

		// Kiểm tra xem số lượng participantIds phải là ít nhất 2
		if (participantIds.length < 2) {
			return res.status(400).json({
				message: 'Cuộc trò chuyện phải có ít nhất 2 người tham gia.',
			});
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
			return res.status(200).json({
				message: 'Cuộc trò chuyện đã tồn tại',
				conversation: matchingConversations[0],
			});
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
			return res.status(400).json({
				message: 'Tồn tại người dùng không hợp lệ',
			});
		}

		// Tạo một cuộc hội thoại mới và lưu
		let conversation = new ConversationModel({
			name: name,
			participantIds: participantIds,
			lastMessage: '',
		});
		conversation = await conversation.save();

		res.status(201).json({
			message: 'Tạo cuộc hội thoại thành công',
			conversation,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getConversations,
	createConversation,
};
