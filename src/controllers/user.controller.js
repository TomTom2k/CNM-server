const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const User = require('../models/user.model');
const Contact = require('../models/contact.model');

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

// for contact
const addContactForUser = async (req, res, next) => {
	try {
		const userId = req.user.UserID;
		const { contactName, phoneNumber } = req.body;

		// Kiểm tra liên hệ này có trong danh bạ hay chưa
		const existingContacts = await Contact.query('UserID')
			.eq(userId)
			.where('PhoneNumber')
			.eq(phoneNumber)
			.exec();

		if (existingContacts && existingContacts.length > 0) {
			return res
				.status(400)
				.json({ error: 'Liên lạc đã tồn tại trong danh bạ.' });
		}

		// Kiểm tra xem có người dùng nào có phoneNumber đó hay không
		const userWithPhoneNumber = await User.query('PhoneNumber')
			.eq(phoneNumber)
			.exec();

		if (!userWithPhoneNumber || userWithPhoneNumber.length === 0) {
			return res.status(404).json({
				error: 'Nguời dùng không tồn tại',
			});
		}

		// Tạo liên hệ mới
		const newContact = new Contact({
			UserID: userId,
			ContactName: contactName,
			PhoneNumber: phoneNumber,
		});
		await newContact.save();

		return res.status(201).json({
			message: 'Liên lạc đã được thêm vào danh bạ.',
			contact: newContact,
		});
	} catch (error) {
		next(error);
	}
};

const getAllContactOfUser = async (req, res, next) => {
	try {
		const userId = req.user.UserID;
		const contacts = await Contact.query('UserID').eq(userId).exec();
		return res.status(200).json({
			message: 'Lấy thành công danh sách liên hệ của người dùng',
			contacts,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	secret,
	signUpWithPhoneNumber,
	signInWithPhoneNumber,
	addContactForUser,
	getAllContactOfUser,
};
