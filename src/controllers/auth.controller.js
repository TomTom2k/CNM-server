const JWT = require('jsonwebtoken');

const UserModel = require('../models/user.model');

const encodedToken = (phoneNumber) => {
	return JWT.sign(
		{
			iss: 'thanhtin',
			sub: phoneNumber,
			iat: new Date().getTime(),
			exp: new Date().setDate(new Date().getDate() + 30), //token có giá trị 30 ngày
		},
		process.env.JWT_SECRET
	);
};

const secret = async (req, res, next) => {
	try {
		const { userID, fullName, phoneNumber, gender, active } = req.user;
		// console.log();
		const user = {
			userID,
			fullName,
			phoneNumber,
			gender,
			active,
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
		const { phoneNumber, password, gender, fullName } = req.body;

		// Check if the phone number is already in use
		const existingUser = await UserModel.query('phoneNumber')
			.eq(phoneNumber)
			.exec();

		if (existingUser && existingUser.count > 0) {
			return res
				.status(400)
				.json({ message: 'Số điện thoại đã được sử dụng.' });
		}

		// Create a new user without sending an OTP
		const newUser = new UserModel({
			phoneNumber: phoneNumber,
			password: password,
			fullName: fullName,
			gender: gender,
			active: true,
		});

		await newUser.save();

		res.status(200).json({
			message: 'Đăng ký thành công!',
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
