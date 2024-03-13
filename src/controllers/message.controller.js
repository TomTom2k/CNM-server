const MessageModel = require('../models/message.model');

const { sendMessageService, getMessagesService } = require("../services/message.service")

const sendMessage = async (req, res, next) => {
	try {
		const data = await sendMessageService(req.user.userID, req.body)
		console.log("message >>>>> " , data.data)
		return res.status(data.status).json({
			message: data.message,
			message: data.data,
		});
	} catch (error) {
		next(error);
	}
};

const getMessages = async (req, res, next) => {
	try {
		const data = await getMessagesService(req.params);

		res.status(data.status).json({ messages: data.data });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	sendMessage,
	getMessages,
};
