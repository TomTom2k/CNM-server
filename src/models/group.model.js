const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');

const GroupSchema = new dynamoose.Schema({
	groupId: {
		type: String,
		hashKey: true,
		default: () => uuidv4(),
	},
	name: String,
	members: {
		type: Array,
		schema: [String],
	},
	creatorId: String,
});

const GroupModel = dynamoose.model('Group', GroupSchema);

export default GroupModel;
