const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('../frontend'));

let documentContent = '';

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.emit('doc update', documentContent);

  socket.on('doc update', (newContent) => {
    documentContent = newContent;
    socket.broadcast.emit('doc update', newContent);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('call-user', (signal) => {
    socket.broadcast.emit('call-user', signal);
  });

  socket.on('accept-call', (signal) => {
    socket.broadcast.emit('call-accepted', signal);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
