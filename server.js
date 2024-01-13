require('dotenv').config();
const app = require('./src/app');

const port = process.env.port || 5000;

const server = app.listen(port, () => {
	console.log('server start with port ', port);
});

process.on('SIGINT', () => {
	server.close(() => console.log('exits server express'));
});
