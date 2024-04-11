const { 
	getConversationsService, 
	createConversationService, 
	getLastMessageService, 
	getRecentlyConversationsService, 
	getRecentlyFriendConversationsService 
} = require("../services/conversation.service")


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
		const data = await createConversationService(req.user.userID, req.body, req.file)

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

const getRecentlyFriendConversations = async (req, res, next) => {
	try {
		const data = await getRecentlyFriendConversationsService(req.user.userID, req.params)

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
	getRecentlyConversations,
	getRecentlyFriendConversations
};
