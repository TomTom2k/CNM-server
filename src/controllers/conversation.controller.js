const { getConversationsService, createConversationService, getLastMessageService, getRecentlyConversationsService } = require("../services/conversation.service")


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

const getLastMessage = async (req, res, next) => {
	try {
		const data = await getLastMessageService(req.user.userID, req.params)

		res.status(data.status).json({
			message: data.message,
			lastMessage: data.data,
		});
	} catch (error) {
		next(error);
	}
};

const getRecentlyConversations = async (req, res, next) => {
	try {
		const data = await getRecentlyConversationsService(req.user.userID, req.params)

		res.status(data.status).json({
			message: data.message,
			conversations: data.data,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getConversations,
	createConversation,
	getLastMessage,
	getRecentlyConversations
};
