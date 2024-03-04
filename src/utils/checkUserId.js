const UserModel = require('../models/user.model');

const checkUserId = async (id) => {
	try {
		const user = await UserModel.get(id);

		if (!user) {
			return false;
		}

		return true;
	} catch (error) {
		throw error;
	}
};

module.exports = checkUserId;
