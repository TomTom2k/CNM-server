const { 
		sendMessageService, 
		getMessagesService, 
		deleteMessageService,
		updateMessageToRevokeMessage 
} = require("../services/message.service")

const sendMessage = async (req, res, next) => {
	try {
		const data = await sendMessageService(req.user.userID, req.body, req.files)
		console.log("Data: ", data)
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
		const data = await getMessagesService(req.params);

		res.status(data.status).json({ messages: data.data });
	} catch (error) {
		next(error);
	}
};

const deleteMessage = async (req, res, next) => {
	try {
		const data = await deleteMessageService(req.params);

		res.status(data.status).json({ message: data.message });
	} catch (error) {
		next(error);
	}
	console.log('deleteMessage is called')
};

const revokeMessage = async (req, res, next) => {
	try{
		const data = await updateMessageToRevokeMessage(req.params);
		res.status(data.status).json({ message: data.message });
	}catch(error){
		next(error);
	}
}
module.exports = {
	sendMessage,
	getMessages,
	deleteMessage,
	revokeMessage,
};
