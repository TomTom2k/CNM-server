require('dotenv').config();
const { startServer } = require('./src/app');

const port = process.env.PORT || 5001;

startServer(port);
