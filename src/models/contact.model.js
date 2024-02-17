const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');

const { Schema } = dynamoose;

const ContactSchema = new Schema({
	contactID: {
		type: String,
		hashKey: true,
		default: () => uuidv4(),
	},
	userID: {
		type: String,
		index: {
			global: true,
			rangeKey: 'contactID',
			project: true,
		},
		required: true,
	},
	contactName: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: String,
		index: true,
		required: true,
	},
});

const ContactModel = dynamoose.model('Contact', ContactSchema);

module.exports = ContactModel;
