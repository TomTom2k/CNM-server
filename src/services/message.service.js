require("dotenv").config()
const AWS = require("../configs/aws.config")
const ConversationModel = require('../models/conversation.model');
const MessageModel = require('../models/message.model');
const { io, getReceiverSocketId } = require('../socket/socket');

const s3 = new AWS.S3();

const sendMessageService = async (senderId, data, files) => {
    const { conversationId, content, type } = data;
    let imageURL = "";

    // Lấy thông tin cuộc trò chuyện
    let conversation = await ConversationModel.get(conversationId);
    if (!conversation) {
        return {
            message: 'Cuộc hội thoại không tồn tại',
            status: 400,
            data: {}
        };
    }

    if (type === "image") {
        for (const file of files) {
            // Lưu từng image vào S3 và lấy ra image url
            const image = file?.originalname.split(".");
            const fileType = image[image.length - 1];
            const filePath = `img_${Date.now().toString()}.${fileType}`;

            const paramsS3 = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: filePath,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            const data = await s3.upload(paramsS3).promise();
            imageURL += data.Location + " "
        }
    }

    // Tạo một tin nhắn mới
    const message = new MessageModel({
        senderId: senderId,
        conversationId: conversation.conversationId,
        content: content || imageURL.trim(),
        type
    });
    if (type === "text") {
        conversation.lastMessage = content
    } else if (type === "image") {
        conversation.lastMessage = "Hình ảnh"
    }

    // await message.save();
    // await conversation.save();
    await Promise.all([message.save(), conversation.save()]);

    conversation.participantIds.forEach((participantId) => {
        if (participantId !== senderId) {
            const receiverSocketId = getReceiverSocketId(participantId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', message);
            }
        }
    });

    return {
        message: 'Gửi tin nhắn thành công',
        status: 200,
        data: message
    };
}

const getMessagesService = async (data) => {
    const { conversationId } = data;

    // Lấy danh sách tin nhắn của cuộc trò chuyện
    const messages = await MessageModel.query('conversationId')
        .eq(conversationId)
        .exec();
    const messageArray = messages.map((message) => message.toJSON());

    // Sắp xếp mảng tin nhắn theo createdAt
    messageArray.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    return {
        data: messageArray,
        status: 200
    };
}

// const deleteMessageService = async (data) => {
//     const { messageId } = data;

//     try {
//         // Tìm và xóa tin nhắn từ cơ sở dữ liệu
//         const deletedMessage = await MessageModel.delete(messageId);

//         // Nếu tin nhắn được xóa thành công
//         if (deletedMessage) {
//             return {
//                 message: 'Xóa tin nhắn thành công',
//                 status: 200,
//                 data: deletedMessage
//             };
//         } else {
//             return {
//                 message: 'Tin nhắn không tồn tại hoặc không thể xóa',
//                 status: 404,
//                 data: {}
//             };
//         }
//     } catch (error) {
//         console.log(error);
//         return {
//             message: 'Đã xảy ra lỗi khi xóa tin nhắn',
//             status: 500,
//             data: {}
//         };
//     }

// }
const deleteMessageService = async (data) => {
    const { messageId } = data;
    console.log('deleteMessageService is called')
    console.log(data)
    try {
        // Find the message in the database
        const message = await MessageModel.get({ messageId });

        // If message doesn't exist
        if (!message) {
            return {
                message: 'Tin nhắn không tồn tại hoặc không thể xóa',
                status: 404,
                data: {}
            };
        }

        // Set selfDelete to true
        message.selfDelete = true;

        // Save the updated message
        await message.save();

        return {
            message: 'Xóa tin nhắn thành công',
            status: 200,
            data: message
        };
    } catch (error) {
        console.log(error);
        return {
            message: 'Đã xảy ra lỗi khi xóa tin nhắn',
            status: 500,
            data: {}
        };
    }
};
const updateMessageToRevokeMessage = async (data) => {
    console.log('updateMessageToRevokeMessage is called')
    const { messageId } = data;
    console.log(data)
    try {
        const message = await MessageModel.get(messageId);
        message.content = "Tin nhắn này đã được thu hồi";
        await message.save();
        return {
            message: 'Thu hồi tin nhắn thành công',
            status: 200,
            data: message
        };
    } catch (error) {
        console.log(error);
        return {
            message: 'Đã xảy ra lỗi khi thu hồi tin nhắn',
            status: 500,
            data: {}
        };
    }
}


module.exports = {
    sendMessageService,
    getMessagesService,
    deleteMessageService,
    updateMessageToRevokeMessage,
}