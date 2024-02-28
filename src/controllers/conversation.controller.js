const Conversation = require('../models/conversation.model');

const getListConversations = async (req, res, next) => {
	try {
		const senderId = req.user.userID;
		const conversations = await Conversation.scan('participantIds').exec();

		const filteredConversations = conversations.filter((conversation) =>
			conversation.participantIds.includes(senderId)
		);

		res.status(200).json({ conversations: filteredConversations });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getListConversations,
};
