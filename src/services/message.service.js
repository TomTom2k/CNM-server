const ConversationModel = require('../models/conversation.model');
const MessageModel = require('../models/message.model');
const { io, getReceiverSocketId } = require('../socket/socket');

const sendMessageService = async (senderId, data) => {
    const { conversationId, content } = data;

    // Lấy thông tin cuộc trò chuyện
    let conversation = await ConversationModel.get(conversationId);
    if (!conversation) {
        return { 
            message: 'Cuộc hội thoại không tồn tại', 
            status: 400, 
            data: {} 
        };
    }

    // Tạo một tin nhắn mới
    const message = new MessageModel({
        senderId: senderId,
        conversationId: conversation.conversationId,
        content: content,
    });
    conversation.lastMessage = content;

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
        data: message,
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