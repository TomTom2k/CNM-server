const { 
	getConversationsService, 
	createConversationService, 
	getLastMessageService, 
	getRecentlyConversationsService, 
	getRecentlyFriendConversationsService,
	addMemberIntoGroupService,
	removeUserIdInGroupService,
	deleteConversationService,
	chanceRoleOwnerService,
	leaveGroupService,
	getAllGroupConversationsOfUserService
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
	 
	try {
		const params = {
			conversationId: req.params,
			userIds: req.body,
		}
		console.log("Params", params)
        const data = await addMemberIntoGroupService(req.user.userID, params);
	
        res.status(data.status).json({
            message: data.message,
            resData: data.data,
        });
    } catch (error) {
		next(error);
    }
}

const removeUserIdInGroup = async (req, res, next) => {
	 
	try {
		const params = {
			conversationId: req.params,
			userId: req.body,
		}
		
		const data = await removeUserIdInGroupService(req.user.userID, params);
	
		res.status(data.status).json({
			message: data.message,
			resData: data.data,
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

const chanceRoleOwner = async (req, res, next) => {
	try {
		const params = {
			conversationId: req.params,
			userId: req.body,
		}
		const data = await chanceRoleOwnerService(req.user.userID, params)

		res.status(data.status).json({
			message: data.message,
			resData: data.data,
		});
	} catch (error) {
		next(error);
	}
}

const leaveGroup = async (req, res, next) => {
	try {
		const params = {
			conversationId: req.params,
			reqData: req.body
		}
		const data = await leaveGroupService(req.user.userID, params)

		res.status(data.status).json({
			message: data.message,
			conversationId: data.data,
		});
	} catch (error) {
		next(error);
	}
}

const getAllGroupConversationsOfUser = async (req, res, next) => {
	try {
		const data = await getAllGroupConversationsOfUserService(req.user.userID)

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
	getRecentlyFriendConversations,
	addMemberIntoGroup,
	removeUserIdInGroup,
	deleteConversation,
	chanceRoleOwner,
	leaveGroup,
	getAllGroupConversationsOfUser
};
