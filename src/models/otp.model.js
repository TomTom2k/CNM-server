const dynamoose = require('dynamoose');
const { Schema } = dynamoose;

const OTPSchema = new Schema(
	{
		phoneNumber: {
			type: String,
            required: true,
		},
		otp: {
			type: String,
            required: true,
		},
		otpExpiration: {
			type: Date,
			default: () => new Date(Date.now() + 60000),
			get: (otpExpiration) => otpExpiration.getTime(),
		},
	},
	{
		timestamps: true,
	}
);

const OTPModel = dynamoose.model('OTP', OTPSchema);

module.exports = OTPModel;
