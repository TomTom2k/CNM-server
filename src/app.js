require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const dynamoose = require('dynamoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// import from source
const router = require('./routes');
const { app, server } = require('./socket/socket');

const startServer = (port) => {
	// middleware
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
	// dynamoose.aws.ddb.local('http://localhost:8000');

	// swagger
	const options = {
		definition: {
			openapi: '3.1.0',
			info: {
				title: 'Zalo clone api',
				version: '0.1.0',
				description: 'API for zalo clone',
			},
			servers: [
				{
					url: process.env.URL,
					description: 'Development server',
				},
			],
		},
		apis: [path.join(__dirname, './swagger/*.js')],
	};

	const specs = swaggerJsdoc(options);
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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

	server.listen(port, () => {
		console.log('Server started on port ', port);
	});
};

module.exports = { startServer };
