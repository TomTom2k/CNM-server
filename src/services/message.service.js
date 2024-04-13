require("dotenv").config()
const { s3 } = require("../configs/aws.config")
const ConversationModel = require('../models/conversation.model');
const MessageModel = require('../models/message.model');
const { io, getReceiverSocketId } = require('../socket/socket');
const User = require('../models/user.model');


const sendMessageService = async (senderId, data, files) => {
    const { conversationId, content, type } = data;
    let fileURL = "";
    let messages = []
    const savedMessages = []

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

    for(const message of messages) {
        // await message.save();
        const savedMessage = await message.save();
        savedMessages.push(savedMessage)

        for(const participantId of conversation.participantIds) {
            if (participantId.participantId !== senderId) {
                const senderInfo = await User.scan('userID')
                .eq(message.senderId)
                .attributes([
                    'profilePic',
                    'fullName'
                ])
                .exec();
                const receiverSocketId = getReceiverSocketId(participantId.participantId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('newMessage', {...savedMessage, senderAvatar: senderInfo[0].profilePic, senderFullName: senderInfo[0].fullName});
                }
            }
        };
    }

    return {
        message: 'Gửi tin nhắn thành công',
        status: 200,
        data: savedMessages
    };
}

const getMessagesService = async (userID, data) => {
    try {
        const { conversationId } = data;
        let resMessages = []
    
        // Lấy danh sách tin nhắn của cuộc trò chuyện
        const messages = await MessageModel.query('conversationId')
            .eq(conversationId)
            .exec();
        const messageArray = messages.map((message) => message.toJSON());
    
        // Lấy danh sách senderIds
        const senderIdsSet = new Set();
        messageArray.forEach(message => {
            if (message.senderId !== userID) {
                senderIdsSet.add(message.senderId);
            }
        });
        const senderIds = Array.from(senderIdsSet);
    
        if(senderIds.length > 0){
            // Lấy thông tin của các sender
            const sendersInfo = await User.batchGet(senderIds, {attributes: ['userID', 'profilePic', 'fullName']});
            for(const message of messageArray){
                if(message.senderId !== userID){
                    const senderInfo = sendersInfo.find(info => info.userID === message.senderId);
                    resMessages.push({...message, senderAvatar: senderInfo.profilePic, senderFullName: senderInfo.fullName})
                }
                else{
                    resMessages.push(message)
                }
            }
        } else {
            resMessages = messageArray
        }
    
        // Sắp xếp mảng tin nhắn theo createdAt
        resMessages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
    
        return {
            data: resMessages,
            status: 200
        };
    } catch (error) {
        console.log(error)
        return {
            data: [],
            status: 500
        };
    }
}

const recallMessageService = async (data) => {
    const { messageId } = data;

    const updatedMessage = await MessageModel.update({ messageId }, { isRecalled: true });

    let conversation = await ConversationModel.get(updatedMessage.conversationId);
    if (!conversation) {
        return {
            message: 'Cuộc hội thoại không tồn tại',
            status: 400,
            data: {}
        };
    }

    conversation.participantIds.forEach((participantId) => {
        if (participantId.participantId !== updatedMessage.senderId) {
            const receiverSocketId = getReceiverSocketId(participantId.participantId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('recallMessage', updatedMessage);
            }
        }
    });

    return {
        message: "Thu hồi tin nhắn thành công",
        status: 200,
        data: updatedMessage
    };
}

const deleteMessageForMeOnlyService = async (userId, data) => {
    const { messageId } = data;

    await MessageModel.update({ messageId }, { $ADD: { deletedUserIds: userId } });
    
    const updatedMessage = await MessageModel.scan('messageId')
    .eq(messageId)
    .exec();

    return {
        message: "Xóa tin nhắn chỉ ở phía tôi thành công",
        status: 200,
        updatedMessage
    };
}

const shareMessageService = async (userId, data) => {
    const { checkedConversations, messageContent, messageType } = data;
    let sharedConversations = []

    for(const checkedConversation of checkedConversations) {
        let conversation = await ConversationModel.get(checkedConversation);
        if (!conversation) {
            return {
                message: 'Cuộc hội thoại không tồn tại',
                status: 400,
                data: []
            };
        }

        const message = new MessageModel({
            senderId: userId,
            conversationId: conversation.conversationId,
            content: messageContent,
            type: messageType
        })

        const savedMessage = await message.save();

        const sharedConversation = {
            conversation,
            savedMessage
        }

        sharedConversations.push(sharedConversation)

        conversation.participantIds.forEach((participantId) => {
            if (participantId.participantId !== userId) {
                const receiverSocketId = getReceiverSocketId(participantId.participantId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('newMessage', savedMessage);
                }
            }
        });
    }

    return {
        message: "Chia sẻ tin nhắn thành công",
        status: 200,
        data: sharedConversations
    };
}

module.exports = {
    sendMessageService,
    getMessagesService,
    recallMessageService,
    deleteMessageForMeOnlyService,
    shareMessageService
}