const { sendOTPService, verifyOTPService } = require("../services/otp.service")

const sendOTP = async (req, res, next) => {
	try {

		const data = await sendOTPService(req.body)

		res.status(data.status).json({
			message: data.message,
		});
	} catch (error) {
		console.error('Error during send OTP:', error);
		next(error);
	}
};

const verifyOTP = async (req, res, next) => {
	try {

		const data = await verifyOTPService(req.body)

		res.status(data.status).json({
			message: data.message,
		});
	} catch (error) {
		console.error('Error during verify OTP:', error);
		next(error);
	}
};

module.exports = {
	sendOTP,
	verifyOTP
};
