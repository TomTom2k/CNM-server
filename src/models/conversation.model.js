const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('./user.model');

const ConversationSchema = new dynamoose.Schema(
	{
		conversationId: {
			type: String,
			hashKey: true,
			default: () => uuidv4(),
		},
		name: String,
		participantIds: {
			type: Array,
			schema: [String],
		},
	},
	{
		saveUnknown: true,
	}
);

const ConversationModel = dynamoose.model('Conversation', ConversationSchema);

module.exports = ConversationModel;
