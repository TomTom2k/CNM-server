require('dotenv').config();
const OTPModel = require('../models/otp.model')

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

const sendOTPService = async (data) => {
    try {
        const { phoneNumber } = data;
        const otp = generateOTP();

        const otpData = new OTPModel({ phoneNumber, otp });
        await otpData.save();

        const message = await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        console.log(message.sid);
        return {
            message: 'Gửi OTP thành công',
            status: 200
        };
    } catch (err) {
        console.error(err);
        return {
            message: 'Gửi OTP không thành công',
            status: 400
        };
    }
};

const verifyOTPService = async (data) => {
    try {
        const { phoneNumber, otp } = data;

        const otpData = await OTPModel.query("phoneNumber").eq(phoneNumber).filter("otp").eq(otp).exec();

        if (otpData.length > 0) {
            if(otpData[0].otpExpiration < Date.now()){
                return {
                    message: 'OTP đã hết hạn',
                    status: 400
                };
            } else {
                return {
                    message: 'Xác thực OTP thành công',
                    status: 200
                };
            }
        } else {
            return {
                message: 'OTP không chính xác',
                status: 404
            };
        }
    } catch (err) {
        console.error(err);
        return {
            message: 'Xác thực OTP không thành công',
            status: 400
        };
    }
};

module.exports = {
	sendOTPService,
    verifyOTPService
}