require('dotenv').config();
const { startServer } = require('./src/app');

const port = process.env.PORT || 5000;

startServer(port);
