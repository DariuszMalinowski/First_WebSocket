// SOCKET
const socket = io();

// referencje
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

// zmienna globalna
let userName = '';

// NASŁUCHIWANIE WIADOMOŚCI
socket.on('message', ({ author, content }) => {
  addMessage(author, content);
});

// LOGIN
loginForm.addEventListener('submit', login);

function login(e) {
  e.preventDefault();

  if (!userNameInput.value) {
    alert('Podaj nazwę użytkownika!');
    return;
  }

  userName = userNameInput.value;

  loginForm.classList.remove('show');
  messagesSection.classList.add('show');

  // INFORMUJ SERWER
  socket.emit('join', userName);
}

// WYSYŁANIE WIADOMOŚCI
addMessageForm.addEventListener('submit', sendMessage);

function sendMessage(e) {
  e.preventDefault();

  if (!messageContentInput.value) {
    alert('Wpisz wiadomość!');
    return;
  }

  const message = {
    author: userName,
    content: messageContentInput.value
  };

  addMessage(message.author, message.content);

  // WYŚLIJ DO SERWERA
  socket.emit('message', message);

  messageContentInput.value = '';
}

// DODAWANIE WIADOMOŚCI
function addMessage(author, content) {
  const message = document.createElement('li');

  message.classList.add('message');
  message.classList.add('message--received');

  if (author === userName) {
    message.classList.add('message--self');
  }

  message.innerHTML = `
    <h3 class="message__author">${author === userName ? 'You' : author}</h3>
    <div class="message__content">
      ${author === 'Chat Bot' ? `<i>${content}</i>` : content}
    </div>
  `;

  messagesList.appendChild(message);
}