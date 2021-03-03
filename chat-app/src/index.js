const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const { generateMessage } = require('../src/utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('New connection');

  socket.emit('message', generateMessage('Welcome!'));
  socket.broadcast.emit('message', generateMessage('A new user has joined'));

  socket.on('sendLocation', ({ ltd, lng }, callback) => {
    // io.emit('message', `Location: https://google.com/maps?q=${ltd},${lng}`);
    io.emit(
      'locationMessage',
      `https://www.openstreetmap.org/#map=17/${ltd}/${lng}`,
    );
    callback('Location shared');
  });

  socket.on('sendMessage', (msg, callback) => {
    io.emit('message', generateMessage(msg));
    callback('Delivered');
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left'));
  });
});

server.listen(port, () => {
  console.log('Listening ', port);
});
