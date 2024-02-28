const Conversation = require('../models/conversation.model');
const User = require('../models/user.model');

const getListConversations = async (req, res, next) => {
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

		const members = await User.batchGet(memberIds, {
			attributes: ['userID', 'fullName', 'profilePic'],
		});

		// Kết hợp thông tin của thành viên vào mỗi cuộc trò chuyện
		const conversationsWithMembers = conversations.map((conversation) => {
			const membersInfo = conversation.participantIds.map((memberId) =>
				members.find((member) => member.userID === memberId)
			);
			return { ...conversation, membersInfo };
		});

		res.status(200).json({ conversations: conversationsWithMembers });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getListConversations,
};
