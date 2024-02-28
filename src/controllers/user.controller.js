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
		const { userID, fullName, phoneNumber, gender, active } = req.user;

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
		const existingUser = await User.query('phoneNumber')
			.eq(phoneNumber)
			.exec();

		if (existingUser && existingUser.count > 0) {
			return res
				.status(400)
				.json({ message: 'Số điện thoại đã được sử dụng.' });
		}

		// Create a new user without sending an OTP
		const newUser = new User({
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

// for contact
const addContactForUser = async (req, res, next) => {
	try {
		const userId = req.user.userID;
		const { contactName, phoneNumber } = req.body;

		// Kiểm tra liên hệ này có trong danh bạ hay chưa
		const existingContacts = await Contact.query('userID')
			.eq(userId)
			.where('phoneNumber')
			.eq(phoneNumber)
			.exec();

		if (existingContacts && existingContacts.length > 0) {
			return res
				.status(400)
				.json({ error: 'Liên lạc đã tồn tại trong danh bạ.' });
		}

		// Kiểm tra xem có người dùng nào có phoneNumber đó hay không
		const userWithPhoneNumber = await User.query('phoneNumber')
			.eq(phoneNumber)
			.exec();

		if (!userWithPhoneNumber || userWithPhoneNumber.length === 0) {
			return res.status(404).json({
				error: 'Nguời dùng không tồn tại',
			});
		}

		// Tạo liên hệ mới
		const newContact = new Contact({
			userID: userId,
			contactName: contactName,
			phoneNumber: phoneNumber,
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
		const userId = req.user.userID;
		const contacts = await Contact.query('userID').eq(userId).exec();
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
