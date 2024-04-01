const JWT = require('jsonwebtoken');

const UserModel = require('../models/user.model');

const { s3 } = require("../configs/aws.config")

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

const multer = require('multer');

const storage = multer.memoryStorage({
	destination(req, file, callback) {
		callback(null, "");
	},
});

const bucketName = process.env.S3_BUCKET_NAME;

const createNewUser = async (user, file) => {
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

	const image = file?.originalname.split(".");//Lấy ra file ảnh từ form
	const fileType = image[image.length - 1];
	const filePath = `${Date.now().toString()}.${file.size}.${file?.originalname}`;//Đặt tên file ảnh theo id và name của course  

	const paramsS3 = {
		Bucket: bucketName,
		Key: filePath,
		Body: file.buffer,
		ContentType: file.mimetype,
	};

	// Upload image to S3
	const data = await s3.upload(paramsS3).promise();
	const profilePic_url = data.Location;

	// Create a new user without sending an OTP
	const newUser = new UserModel({
		phoneNumber: phoneNumber,
		password: password,
		fullName: fullName,
		dateOfBirth: dateOfBirth,
		gender: gender,
		active: true,
		profilePic: profilePic_url,
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