const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');

const { Schema } = dynamoose;

const ContactSchema = new Schema({
	ContactID: {
		type: String,
		hashKey: true,
		default: () => uuidv4(),
	},
	UserID: {
		type: String,
		index: {
			global: true,
			rangeKey: 'ContactID',
			project: true,
		},
		required: true,
	},
	ContactName: {
		type: String,
		required: true,
	},
	PhoneNumber: {
		type: String,
		index: true,
		required: true,
	},
});

const ContactModel = dynamoose.model('Contact', ContactSchema);

module.exports = ContactModel;
