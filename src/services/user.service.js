const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/user.model');
const ContactModel = require('../models/contact.model');

const s3 = new AWS.S3();

const addContactForUserService = async (userId, data) => {
    const { contactName, phoneNumber } = data;

    // Kiểm tra liên hệ này có trong danh bạ hay chưa
    const existingContacts = await ContactModel.query('userID')
        .eq(userId)
        .where('phoneNumber')
        .eq(phoneNumber)
        .exec();

    if (existingContacts && existingContacts.length > 0) {
        return { 
            message: 'Liên lạc đã tồn tại trong danh bạ.', 
            status: 400,
            data: {} 
        };
    }

    // Kiểm tra xem có người dùng nào có phoneNumber đó hay không
    const userWithPhoneNumber = await UserModel.query('phoneNumber')
        .eq(phoneNumber)
        .exec();

    if (!userWithPhoneNumber || userWithPhoneNumber.length === 0) {
        return {
            message: 'Nguời dùng không tồn tại',
            status: 404,
            data: {}
        };
    }

    // Tạo liên hệ mới
    const newContact = new ContactModel({
        userID: userId,
        contactName: contactName,
        phoneNumber: phoneNumber,
    });
    await newContact.save();

    return {
        message: 'Liên lạc đã được thêm vào danh bạ.',
        status: 201,
        data: newContact,
    };
}

const getAllContactOfUserService = async (userId) => {
    const contacts = await Contact.query('userID').eq(userId).exec();
    return {
        message: 'Lấy thành công danh sách liên hệ của người dùng',
        status: 200,
        data: contacts,
    };
}

const findUserByPhoneNumberService = async (user, data) => {
    const { userID } = user;
    const { phoneNumber } = data;
    const users = await UserModel.scan('phoneNumber')
        .contains(phoneNumber.trim())
        .filter((user) => user.userID !== userID)
        .attributes(['userID', 'phoneNumber', 'fullName', 'profilePic'])
        .exec();

    return {
        message: 'Tìm thành công',
        status: 200,
        data: users,
    };
}

const updateProfilePicService = async (user, file) => {
    const { userID } = user;

    const image = file.originalname.split('.');
    const fileType = image[image.length - 1];
    const filePath = `avt_${Date.now().toString()}.${fileType}`;

    const paramsS3 = {
        Bucket: 'zalo-clone',
        Key: filePath,
        Body: file.buffer,
        ContentType: 'image/png',
        ContentDisposition: 'inline',
    };

    // Tải ảnh lên S3
    const data = await s3.upload(paramsS3).promise();
    const profilePic = data.Location;

    // Cập nhật thông tin người dùng
    await UserModel.update({ userID }, { profilePic });

    // Lấy thông tin người dùng sau khi cập nhật
    const updatedUser = await UserModel.scan('userID')
        .eq(userID)
        .attributes([
            'userID',
            'gender',
            'phoneNumber',
            'fullName',
            'profilePic',
        ])
        .exec();

    return res.status(200).json({
        message: 'Cập nhật thông tin thành công',
        status: 200,
        data: updatedUser,
    });
}

module.exports = {
    addContactForUserService,
    getAllContactOfUserService,
    findUserByPhoneNumberService,
    updateProfilePicService
}