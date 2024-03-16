const { encodedToken, createNewUser } = require("../services/auth.service")

const secret = async (req, res, next) => {
	try {
		const { userID, fullName, phoneNumber, gender, profilePic } = req.user;
		const user = {
			userID,
			fullName,
			phoneNumber,
			gender,
			profilePic,
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
