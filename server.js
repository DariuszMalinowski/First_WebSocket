const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

// TABLICE
const messages = [];
let users = [];

// statyczne pliki
app.use(express.static(path.join(__dirname, 'client')));

// route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// START SERVERA
const server = app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});

// SOCKET.IO
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client:', socket.id);

  // USER JOIN
  socket.on('join', (name) => {
    const user = { name, id: socket.id };
    users.push(user);

    console.log('User joined:', user);

    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: `${name} has joined the conversation!`
    });
  });

  // MESSAGE
  socket.on('message', (message) => {
    messages.push(message);

    socket.broadcast.emit('message', message);
  });

  // DISCONNECT
  socket.on('disconnect', () => {
    const user = users.find(u => u.id === socket.id);

    if(user) {
      users = users.filter(u => u.id !== socket.id);

      console.log('User left:', user);

      socket.broadcast.emit('message', {
        author: 'Chat Bot',
        content: `${user.name} has left the conversation... :(`
      });
    }
  });

});