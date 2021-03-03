const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/messages');
const {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('New connection');

  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) return callback(error);

    socket.join(room);

    socket.emit('message', generateMessage('Admin', 'Welcome!'));
    socket.broadcast
      .to(user.room)
      .emit('message', generateMessage('Admin', `${user.username} has joined`));
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('sendLocation', ({ ltd, lng }, callback) => {
    const { username, room } = getUser(socket.id);

    io.to(room).emit(
      'locationMessage',
      generateLocationMessage(
        username,
        `https://www.openstreetmap.org/#map=17/${ltd}/${lng}`,
      ),
    );
    callback('Location shared');
  });

  socket.on('sendMessage', (msg, callback) => {
    const { username, room } = getUser(socket.id);

    io.to(room).emit('message', generateMessage(username, msg));
    callback('Delivered');
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage('Admin', `${user.username} has left`),
      );
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log('Listening ', port);
});
