const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');
const { Schema } = dynamoose;

const MessageSchema = new Schema(
	{
		messageId: {
			type: String,
			hashKey: true,
			default: () => uuidv4(),
		},
		conversationId: {
			type: String,
			index: true,
		},
		senderId: String,
		content: String,
		type: String
	},
	{
		timestamps: true,
	}
);

const MessageModel = dynamoose.model('Message', MessageSchema);

module.exports = MessageModel;
