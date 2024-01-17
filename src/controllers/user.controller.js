const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const User = require('../models/user.model');

const encodedToken = (phoneNumber) => {
	return JWT.sign(
		{
			iss: 'thanhtin',
			sub: phoneNumber,
			iat: new Date().getTime(),
			exp: new Date().setDate(new Date().getDate() + 30),
		},
		process.env.JWT_SECRET
	);
};

const secret = async (req, res, next) => {
	try {
		const {
			UserID,
			FirstName,
			LastName,
			PhoneNumber,
			AuthType,
			Role,
			Active,
		} = req.user;

		const user = {
			UserID,
			FirstName,
			LastName,
			PhoneNumber,
			AuthType,
			Role,
			Active,
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
		const token = encodedToken(req.user.PhoneNumber);
		res.setHeader('Authorization', token);

		res.status(200).json({
			message: 'Đăng nhập thành công!',
		});
	} catch (error) {
		console.error('Error during sign-in:', error);
		next(error);
	}
};

const signUpWithPhoneNumber = async (req, res, next) => {
	try {
		const { phoneNumber, password, firstName, lastName } = req.body;

		// Check if the phone number is already in use
		const existingUser = await User.query('PhoneNumber')
			.eq(phoneNumber)
			.exec();

		if (existingUser && existingUser.count > 0) {
			return res
				.status(400)
				.json({ message: 'Số điện thoại đã được sử dụng.' });
		}

		// Create a new user without sending an OTP
		const newUser = new User({
			PhoneNumber: phoneNumber,
			Password: password,
			FirstName: firstName,
			LastName: lastName,
			AuthType: 'phone',
			Active: true,
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
	signUpWithPhoneNumber,
	signInWithPhoneNumber,
};
