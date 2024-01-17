const dynamoose = require('dynamoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Schema } = dynamoose;

const UserSchema = new Schema({
	UserID: {
		type: String,
		hashKey: true,
		default: () => uuidv4(),
	},
	FirstName: String,
	LastName: String,
	Password: {
		type: String,
		set: (value) => bcrypt.hashSync(value, 10),
	},
	Email: String,
	PhoneNumber: {
		type: String,
		index: {
			name: 'PhoneNumberGlobalIndex',
		},
	},
	AuthType: {
		type: String,
		enum: ['phone', 'email', 'google'],
		default: 'local',
	},
	Role: {
		type: String,
		enum: ['staff', 'client'],
		default: 'client',
	},
	Active: {
		type: Boolean,
		default: false,
	},
	CreatedAt: {
		type: Date,
		default: () => new Date(),
	},
	UpdatedAt: {
		type: Date,
		default: () => new Date(),
	},
});

const UserModel = dynamoose.model('User', UserSchema);

module.exports = UserModel;
