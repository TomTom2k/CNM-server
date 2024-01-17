const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dynamoose = require('dynamoose');

// import from source
const router = require('./routes');

const app = express();

// middleware
// cấu hình cors
app.use(
	cors({
		exposedHeaders: ['Authorization'],
	})
);
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use(bodyParser.json());

// connect db
const ddb = new dynamoose.aws.ddb.DynamoDB({
	credentials: {
		accessKeyId: process.env.ACCESS_KEY_ID,
		secretAccessKey: process.env.SECRET_ACCESS_KEY,
	},
	region: process.env.REGION,
});

dynamoose.aws.ddb.set(ddb);
dynamoose.aws.ddb.local('http://localhost:8000');

// router
app.use('/api', router);

// ném lỗi 404
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	const error = app.get('env') === 'development' ? err : {};
	const status = error.status || 500;

	// response to client
	return res.status(status).json({
		err: {
			message: err?.message,
		},
	});
});

module.exports = app;
