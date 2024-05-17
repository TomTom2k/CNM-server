const { encodedToken, createNewUser } = require("../services/auth.service")

const secret = async (req, res, next) => {
	try {
		const { userID, fullName, dateOfBirth, phoneNumber, gender, profilePic, friends, listRequestAddFriendsSent, listRequestAddFriendsReceived } = req.user;
		const user = {
			userID,
			fullName,
			dateOfBirth,
			phoneNumber,
			gender,
			profilePic,
			friends,
			listRequestAddFriendsSent,
			listRequestAddFriendsReceived
		};

		return res.status(200).json({
			message: 'User fetched successfully!',
			user: user,
		});
	} catch (error) {
		next(error);
	}
};

const signInWithPhoneNumber = async (req, res, next) => {
	try {
		const token = encodedToken(req.user.phoneNumber);
		res.setHeader('Authorization', token);

		res.status(200).json({
			message: 'Đăng nhập thành công!',
		});
	} catch (error) {
		next(error);
	}
};

const signUpWithPhoneNumber = async (req, res, next) => {
	try {
		const data = await createNewUser(req.body)

		res.status(data.status).json({
			message: data.message,
		});
	} catch (error) {
		console.error('Error during phone sign up:', error);
		next(error);
	}
};

module.exports = {
	secret,
	signInWithPhoneNumber,
	signUpWithPhoneNumber,
};
