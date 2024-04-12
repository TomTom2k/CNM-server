const { 
	sendMessageService, 
	getMessagesService, 
	recallMessageService,
	deleteMessageForMeOnlyService,
	shareMessageService
} = require("../services/message.service")

const sendMessage = async (req, res, next) => {
	try {
		const data = await sendMessageService(req.user.userID, req.body, req.files)

		return res.status(data.status).json({
			message: data.message,
			message: data.data
		});
	} catch (error) {
		next(error);
	}
};

const getMessages = async (req, res, next) => {
	try {
		const data = await getMessagesService(req.user.userID, req.params);

		res.status(data.status).json({ messages: data.data });
	} catch (error) {
		next(error);
	}
};

const recallMessage = async (req, res, next) => {
	try {
		const data = await recallMessageService(req.params);

		res.status(data.status).json({ message: data.message, updatedMessage: data.data });
	} catch (error) {
		next(error);
	}
};

const deleteMessageForMeOnly = async (req, res, next) => {
	try {
		const data = await deleteMessageForMeOnlyService(req.user.userID, req.params);

		res.status(data.status).json({ message: data.message, updatedMessage: data.updatedMessage[0] });
	} catch (error) {
		next(error);
	}
};

const shareMessage = async (req, res, next) => {
	try {
		const data = await shareMessageService(req.user.userID, req.body);

		res.status(data.status).json({ message: data.message, data: data.data });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	sendMessage,
	getMessages,
	recallMessage,
	deleteMessageForMeOnly,
	shareMessage
};
