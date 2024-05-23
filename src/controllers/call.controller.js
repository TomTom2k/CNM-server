const { makeACallOneService, makeACallGroupService } = require("../services/call.service")

const makeACallOne = async (req, res, next) => {
	try {

		const data = await makeACallOneService(req.body)

		res.status(data.status).json({
			message: data.message,
			savedMessage: data.data
		});
	} catch (error) {
		console.error('Error during send OTP:', error);
		next(error);
	}
};

const makeACallGroup = async (req, res, next) => {
	try {

		const data = await makeACallGroupService(req.body)

		res.status(data.status).json({
			message: data.message,
			savedMessage: data.data
		});
	} catch (error) {
		console.error('Error during send OTP:', error);
		next(error);
	}
};

module.exports = {
	makeACallOne,
	makeACallGroup
};
