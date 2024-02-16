const dynamoose = require('dynamoose');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Schema } = dynamoose;

const UserSchema = new Schema(
	{
		userID: {
			type: String,
			hashKey: true,
			default: () => uuidv4(),
		},
		fullName: String,
		password: {
			type: String,
			set: (value) => bcrypt.hashSync(value, 10),
		},
		gender: {
			type: String,
			enum: ['male', 'female'],
		},
		phoneNumber: {
			type: String,
			index: {
				name: 'PhoneNumberGlobalIndex',
			},
		},
		active: {
			type: Boolean,
			default: false,
		},
		profilePic: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: 'true',
	}
);

const UserModel = dynamoose.model('User', UserSchema);

module.exports = UserModel;
