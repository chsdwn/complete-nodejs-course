const socket = io();
const sendBtn = document.getElementById('sendBtn');
const msgInput = document.getElementById('msgInput');

socket.on('message', (msg) => console.log(msg));

socket.on('sendMessage', (msg) => console.log(msg));

sendBtn.addEventListener('click', () => {
  socket.emit('sendMessage', msgInput.value);
  msgInput.textContent = '';
});
