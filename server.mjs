import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on("connection", (socket) => {
  socket.on('send message', (message) => {
    io.emit('chat message', message);
  });

  socket.on('typing', (typing) => {
    socket.broadcast.emit('typing message', typing);
  });
});

app.get('/');


server.listen(3000, () => console.log('Listening on port 3000'));
