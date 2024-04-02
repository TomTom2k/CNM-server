const {
	addContactForUserService,
	getAllContactOfUserService,
	findUserByPhoneNumberService,
	updateProfilePicService,
	changePasswordService,
	updateUserInfoService
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

module.exports = {
	addContactForUser,
	getAllContactOfUser,
	findUserByPhoneNumber,
	updateProfilePic,
	changePassword,
	updateUserInfo
};
