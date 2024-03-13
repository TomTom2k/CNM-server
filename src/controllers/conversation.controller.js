const { getConversationsService, createConversationService } = require("../services/conversation.service")


const getConversations = async (req, res, next) => {
	try {
		const data = await getConversationsService(req.user.userID)
		
		res.status(data.status).json({ conversations: data.data });
	} catch (error) {
		next(error);
	}
};

const createConversation = async (req, res, next) => {
	try {
		const data = await createConversationService(req.body)

		res.status(data.status).json({
			message: data.message,
			conversation: data.data,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getConversations,
	createConversation,
};
