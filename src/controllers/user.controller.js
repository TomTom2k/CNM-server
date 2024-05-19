const {
	addContactForUserService,
	getAllContactOfUserService,
	findUserByPhoneNumberService,
	updateProfilePicService,
	changePasswordService,
	updateUserInfoService,
	updateUserPasswordService,
	addFriendService,
	requestAddFriendsSent,
	getAllInFoUser,
	getUserById,
	cancelAddFriends,
	cancelRequestAddFriendsService,
	deleteFriendService,
	getAllFriendsWithConversationIdService,
	findUsersByIdsService
} = require("../services/user.service")

// Contact
const addContactForUser = async (req, res, next) => {
	try {
		const data = await addContactForUserService(req.user.userID, req.body);

		return res.status(data.status).json({
			message: data.message,
			contact: data.data,
		});
	} catch (error) {
		next(error);
	}
};

const getAllContactOfUser = async (req, res, next) => {
	try {
		const data = await getAllContactOfUserService(req.user.userID);

		return res.status(data.status).json({
			message: data.message,
			contacts: data.data,
		});
	} catch (error) {
		next(error);
	}
};

const findUserByPhoneNumber = async (req, res, next) => {
	try {
		const data = await findUserByPhoneNumberService(req.user, req.query)

		return res.status(data.status).json({
			message: data.message,
			users: data.data,
		});
	} catch (error) {
		next(error);
	}
};

const updateProfilePic = async (req, res, next) => {
	try {
		const data = await updateProfilePicService(req.user, req.file)

		return res.status(data.status).json({
			message: data.message,
			updatedUser: data.data,
		});
	} catch (error) {
		next(error);
	}
};

const changePassword = async (req, res, next) => {
	try {
		const data = await changePasswordService(req.body)
		return res.status(data.status).json({
			message: data.message,
		});
	} catch (error) {
		next(error);
	}
};

const updateUserInfo =  async (req, res, next) => {
	try {
		const data = await updateUserInfoService(req.user, req.body)

		return res.status(data.status).json({
			message: data.message,
			updatedUser: data.data,
		});
	} catch (error) {
		next(error);
	}
};

const updateUserPassword =  async (req, res, next) => {
	try {
		const data = await updateUserPasswordService(req.user, req.body)

		return res.status(data.status).json({
			message: data.message,
			updatedUser: data.data,
		});
	} catch (error) {
		next(error);
	}
};
const addFriend = async (req, res, next) => {
	try {
		const data = await addFriendService(req.body);

		return res.status(data.status).json({
			message: data.message,
			data: data.data,
		});
	} catch (error) {
		next(error);
	}
}

const sentAddFriend = async (req, res, next) => {
	try {
		const data = await requestAddFriendsSent(req.body);

		return res.status(data.status).json({
			message: data.message,
			updatedUser: data.data,
		});
	} catch (error) {
		next(error);
	}
}

const inFoUser = async (req, res, next) => {
	console.log(req.user.userID);
	try {
		const data = await getAllInFoUser(req.user.userID);
		return res.status(data.status).json({
			message: data.message,
			user: data.data,
		});
	} catch (error) {	
		next(error);
	}
}

const findUserById = async (req, res, next) => {
	try {
		const data = await getUserById(req.params.userId);

		return res.status(data.status).json({
			message: data.message,
			user: data.data,
		});
	} catch (error) {
		next(error);
	}
}

const cancelFriend = async (req, res, next) => {
	try {
		const params = {
			userId: req.user.userID,
			friendId: req.body.friendId,
		}
		const data = await cancelAddFriends(params);
	
		return res.status(data.status).json({
			message: data.message,
			canceledFriend: data.data,
		});
	} catch (error) {
		next(error);
	}
}

const cancelRequestAddFriends = async (req, res, next) =>{
	try {
		const params = {
			userId: req.user.userID,
			userRequestedId: req.body.userRequestedId,
		}
		
		const data = await cancelRequestAddFriendsService(params)

		return res.status(data.status).json({
			message: data.message,
			refusedFriend: data.data,
		})
	} catch (error) {
		next(error)
	}
}

const deleteFriend = async (req, res, next) => {
	try {
		const params = {
			userId: req.user.userID,
			friendId: req.body.friendId,
		}
		const data = await deleteFriendService(params);
	
		return res.status(data.status).json({
			message: data.message,
			deletedUser: data.data,
		});
	} catch (error) {
		next(error);
	}
}

const getAllFriendsWithConversationId = async (req, res, next) => {
	try {
		const data = await getAllFriendsWithConversationIdService(req.user)

		res.status(data.status).json({
			message: data.message,
			friends: data.data,
		});
	} catch (error) {
		next(error);
	}
};

const findUsersByIds = async (req, res, next) => {
	try {
		const data = await findUsersByIdsService(req.query)

		return res.status(data.status).json({
			message: data.message,
			users: data.data,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	addContactForUser,
	getAllContactOfUser,
	findUserByPhoneNumber,
	updateProfilePic,
	changePassword,
	updateUserInfo,
	updateUserPassword,
	addFriend,
	sentAddFriend,
	inFoUser,
	findUserById,
	cancelFriend,
	cancelRequestAddFriends,
	deleteFriend,
	getAllFriendsWithConversationId,
	findUsersByIds
};
