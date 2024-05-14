const JWT = require('jsonwebtoken');

const UserModel = require('../models/user.model');

require('dotenv').config();

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

const createNewUser = async (user) => {
	const { phoneNumber, password, gender, fullName, dateOfBirth } = user;

	// Check if the phone number is already in use
	const existingUser = await UserModel.query('phoneNumber')
		.eq(phoneNumber)
		.exec();

	if (existingUser && existingUser.count > 0) {
		return {
			message: 'Số điện thoại đã được sử dụng.',
			status: 400
		};
	}

	// Create a new user without sending an OTP
	const newUser = new UserModel({
		phoneNumber: phoneNumber,
		password: password,
		fullName: fullName,
		dateOfBirth: dateOfBirth,
		gender: gender,
		active: true,
	});

	await newUser.save();

	return {
		message: 'Đăng ký thành công!',
		status: 200
	};
}

module.exports = {
	encodedToken,
	createNewUser
}