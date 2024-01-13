const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// import from source
const router = require('./routes');

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use(bodyParser.json());

// router
app.use(router);

// catch 404 errors and forward them to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 400;
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
