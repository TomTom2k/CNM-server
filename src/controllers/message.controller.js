const MessageModel = require('../models/message.model');
const UserModel = require('../models/user.model');
const ConversationModel = require('../models/conversation.model');

const sendMessage = async (req, res, next) => {
	try {
		const senderId = req.user.userID;
		const { conversationId, receiverId, content } = req.body;

		let conversation;

		if (conversationId) {
			conversation = await ConversationModel.get(conversationId);
			if (!conversation) {
				return res
					.status(400)
					.json({ message: 'Cuộc hội thoại không tồn tại' });
			}
		} else {
			const receiver = await UserModel.get(receiverId);
			if (!receiver) {
				return res
					.status(400)
					.json({ message: 'Người nhận không tồn tại' });
			}
			conversation = new ConversationModel({
				participantIds: [senderId, receiverId],
				lastMessage: '',
			});
			conversation = await conversation.save();
		}

		// Tạo một tin nhắn mới
		const message = new MessageModel({
			senderId: senderId,
			conversationId: conversation.conversationId,
			content: content,
		});
		await message.save();

		// Cập nhật lastMessage của cuộc trò chuyện
		conversation.lastMessage = content;
		await conversation.save();

		return res.status(200).json({
			message: 'Gửi tin nhắn thành công',
			message,
		});
	} catch (error) {
		next(error);
	}
};

const getMessages = async (req, res, next) => {
	try {
		const { conversationId } = req.params;

		const messages = await MessageModel.query('conversationId')
			.eq(conversationId)
			.sort('createdAt')
			.exec();
		const messageArray = messages.map((message) => message.toJSON());
		// Sắp xếp mảng tin nhắn theo createdAt
		messageArray.sort(
			(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
		);

		res.status(200).json({ messages: messageArray });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	sendMessage,
	getMessages,
};
