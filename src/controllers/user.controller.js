const UserModel = require('../models/user.model');
const ContactModel = require('../models/contact.model');

// Contact
const addContactForUser = async (req, res, next) => {
	try {
		const userId = req.user.userID;
		const { contactName, phoneNumber } = req.body;

		// Kiểm tra liên hệ này có trong danh bạ hay chưa
		const existingContacts = await ContactModel.query('userID')
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
		const userWithPhoneNumber = await UserModel.query('phoneNumber')
			.eq(phoneNumber)
			.exec();

		if (!userWithPhoneNumber || userWithPhoneNumber.length === 0) {
			return res.status(404).json({
				error: 'Nguời dùng không tồn tại',
			});
		}

		// Tạo liên hệ mới
		const newContact = new ContactModel({
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

const findUserByPhoneNumber = async (req, res, next) => {
	try {
		const { userID } = req.user;
		const { phoneNumber } = req.query;
		const users = await UserModel.scan('phoneNumber')
			.contains(phoneNumber.trim())
			.filter((user) => user.userID !== userID)
			.attributes(['userID', 'phoneNumber', 'fullName', 'profilePic'])
			.exec();

		return res.status(200).json({
			message: 'Tìm thành công',
			users,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	addContactForUser,
	getAllContactOfUser,
	findUserByPhoneNumber,
};
