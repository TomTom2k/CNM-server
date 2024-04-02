const { Server } = require('socket.io');
const express = require('express');
const http = require('http');

// const app = require('../app');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST', 'PUT'],
	},
});

const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {};

io.on('connection', (socket) => {
	console.log('a user connected', socket.id);

	const userId = socket.handshake.query.userId;
	if (userId !== 'undefined') userSocketMap[userId] = socket.id;

	io.emit('getOnlineUsers', Object.keys(userSocketMap));

	socket.on('disconnect', () => {
		console.log('user disconnect', socket.id);
		delete userSocketMap[userId];
		io.emit('getOnlineUsers', Object.keys(userSocketMap));
	});
});

module.exports = { server, app, io, getReceiverSocketId };
