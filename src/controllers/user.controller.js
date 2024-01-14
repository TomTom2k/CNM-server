const UserModel = require('../models/user.model');

const createUser = async (req, res, next) => {
	try {
		const {
			UserID,
			FirstName,
			LastName,
			Password,
			Email,
			PhoneNumber,
			AuthType,
			Role,
		} = req.body;
		const user = new UserModel({
			UserID,
			FirstName,
			LastName,
			Password,
			Email,
			PhoneNumber,
			AuthType,
			Role,
		});

		await user.save();
		res.json({ message: 'Create user success!!!' });
	} catch (error) {
		next(error);
	}
};

const getAllUsers = async (req, res, next) => {
	try {
		const users = await UserModel.scan().exec(); // Sử dụng scan để lấy tất cả các items
		res.json(users);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createUser,
	getAllUsers,
};
