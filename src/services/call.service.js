const { io, getReceiverSocketId } = require('../socket/socket');
const MessageModel = require('../models/message.model');

const makeACallOneService = async (data) => {
    const { senderInfo, recipientId, callUrl, conversationId, callType } = data

    try {
        const message = new MessageModel({
            senderId: senderInfo.userID,
            conversationId: conversationId,
            content: callType === "voice" ? "Cuộc gọi thoại" : "Cuộc gọi video",
            seenUserIds : [senderInfo.userID],
            type: callType === "voice" ? "voice-call" : "video-call",
        })

        const savedMessage = await message.save()

        const receiverSocketId = getReceiverSocketId(recipientId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', {...savedMessage, senderAvatar: senderInfo?.profilePic, senderFullName: senderInfo.fullName});
            io.to(receiverSocketId).emit('makeACallOne', {senderInfo, callUrl, savedMessage});
        }

        return {
            message: 'Tạo cuộc gọi thành công',
            status: 200,
            data: savedMessage
        };
    } catch (err) {
        console.error(err);
        return {
            message: 'Tạo cuộc gọi không thành công',
            status: 400,
            data: {}
        };
    }
};

const makeACallGroupService = async (data) => {
    const { senderInfo, recipientIds, callUrl, conversationInfo, callType } = data

    try {
        const message = new MessageModel({
            senderId: senderInfo.userID,
            conversationId: conversationInfo.conversationId,
            content: callType === "voice" ? "Cuộc gọi thoại" : "Cuộc gọi video",
            seenUserIds : [senderInfo.userID],
            type: callType === "voice" ? "voice-call" : "video-call",
        })

        const savedMessage = await message.save()

        for(const recipientId of recipientIds) {
            const receiverSocketId = getReceiverSocketId(recipientId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', {...savedMessage, senderAvatar: senderInfo?.profilePic, senderFullName: senderInfo?.fullName});
                io.to(receiverSocketId).emit('makeACallGroup', {conversationInfo, callUrl, savedMessage});
            }
        }

        return {
            message: 'Tạo cuộc gọi thành công',
            status: 200,
            data: savedMessage
        };
    } catch (err) {
        console.error(err);
        return {
            message: 'Tạo cuộc gọi không thành công',
            status: 400,
            data: {}
        };
    }
};

module.exports = {
	makeACallOneService,
    makeACallGroupService
}