const express = require('express');
const path = require('path');

const app = express();

// TABLICA WIADOMOŚCI
const messages = [];

// middleware do plików statycznych (client)
app.use(express.static(path.join(__dirname, 'client')));

// główny route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// start serwera
app.listen(8000, () => {
  console.log('Server running on http://localhost:8000');
});