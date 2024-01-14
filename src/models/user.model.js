const dynamoose = require('dynamoose');
const { Schema } = dynamoose;

const User = new Schema({
	UserID: {
		type: String,
		hashKey: true,
		required: true,
	},
	FirstName: String,
	LastName: String,
	Password: String,
	Email: String,
	PhoneNumber: String,
	AuthType: {
		type: String,
		enum: ['local', 'google'],
		default: 'local',
	},
	Role: {
		type: String,
		enum: ['staff', 'client'],
		default: 'client',
	},
});

const UserModel = dynamoose.model('User', User);

module.exports = UserModel;
