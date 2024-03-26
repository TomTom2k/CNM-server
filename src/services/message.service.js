require("dotenv").config()
const { s3 } = require("../configs/aws.config")
const ConversationModel = require('../models/conversation.model');
const MessageModel = require('../models/message.model');
const { io, getReceiverSocketId } = require('../socket/socket');


const sendMessageService = async (senderId, data, files) => {
    const { conversationId, content, type } = data;
    let fileURL = "";
    let messages = []

    // Lấy thông tin cuộc trò chuyện
    let conversation = await ConversationModel.get(conversationId);
    if (!conversation) {
        return { 
            message: 'Cuộc hội thoại không tồn tại', 
            status: 400, 
            data: {} 
        };
    }

    if (type === "image" || type === "file" || type === "like") {
        for(const file of files) {
            // Lưu từng file vào S3 và lấy ra file url
            const filePath = `${Date.now().toString()}.${file.size}.${file?.originalname}`;
    
            const paramsS3 = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: filePath,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
    
            const data = await s3.upload(paramsS3).promise();
            if(type === "file"){
                messages.push(new MessageModel({
                    senderId: senderId,
                    conversationId: conversation.conversationId,
                    content: data.Location,
                    type
                }))
            } else {
                fileURL += data.Location + " "
            }
        }
    }

    if(type !== "file"){
        // Tạo một tin nhắn mới
        messages.push(new MessageModel({
            senderId: senderId,
            conversationId: conversation.conversationId,
            content: content || fileURL.trim(),
            type
        }))
    }

    if(type === "text"){
        conversation.lastMessage = content
    } else if(type === "image"){
        conversation.lastMessage = "🖼️ Hình ảnh"
    } else if(type === "file"){
        conversation.lastMessage = "🔗 " + files[files.length - 1].originalname
    } else if(type === "like"){
        conversation.lastMessage = fileURL.trim()
    }
    conversation.lastMessageType = type

    // await conversation.save();
    await Promise.all([conversation.save()]);
    for(const message of messages) {
        // await message.save();
        await Promise.all([message.save()]);

        conversation.participantIds.forEach((participantId) => {
            if (participantId !== senderId) {
                const receiverSocketId = getReceiverSocketId(participantId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('newMessage', message);
                }
            }
        });
    }

    return {
        message: 'Gửi tin nhắn thành công',
        status: 200,
        data: messages
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

module.exports = {
    sendMessageService,
    getMessagesService
}