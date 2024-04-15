const { 
	getConversationsService, 
	createConversationService, 
	getLastMessageService, 
	getRecentlyConversationsService, 
	getRecentlyFriendConversationsService,
	addMemberIntoGroupService,
	removeUserIdInGroupService,
	deleteConversationService
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

const addMemberIntoGroup = async (req, res, next) => {
	console.log("Controller Called")
	console.log(req.params)
	console.log(req.body)
	 
	try {
		const params = {
			conversationId: req.params,
			userIds: req.body,
		}
		console.log("Params", params)
        const data = await addMemberIntoGroupService(params);
	
        res.status(data.status).json({
            message: data.message,
            participantId: data.data,
        });
    } catch (error) {
		next(error);
    }
}

const removeUserIdInGroup = async (req, res, next) => {
	console.log("Controller Called")
	console.log(req.params)
	console.log(req.body)
	 
	try {
		const params = {
			conversationId: req.params,
			userId: req.body,
		}
		console.log("Params", params)
		const data = await removeUserIdInGroupService(params);
	
		res.status(data.status).json({
			message: data.message,
			userInfoRemoved: data.data,
		});
	}
	catch (error) {
		next(error);
	}
}

const deleteConversation = async (req, res, next) => {
	try {
		const data = await deleteConversationService(req.user.userID, req.params)

		res.status(data.status).json({
			message: data.message,
			conversation: data.data,
		});
	} catch (error) {
		next(error);
	}
}

module.exports = {
	getConversations,
	createConversation,
	getLastMessage,
	getRecentlyConversations,
	getRecentlyFriendConversations,
	addMemberIntoGroup,
	removeUserIdInGroup,
	deleteConversation
};
