const socket = io();
const sendBtn = document.getElementById('sendBtn');
const shareLocationBtn = document.getElementById('shareLocationBtn');
const msgInput = document.getElementById('msgInput');

socket.on('message', (msg) => console.log(msg));
socket.on('sendMessage', (msg) => console.log(msg));

sendBtn.addEventListener('click', () => {
  socket.emit('sendMessage', msgInput.value, (msg) => {
    console.log(msg);
  });
  msgInput.textContent = '';
});

shareLocationBtn.addEventListener('click', () => {
  if (!navigator.geolocation)
    return alert('Your browser does not supports geolocation');

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit('sendLocation', { ltd: latitude, lng: longitude }, (msg) => {
      console.log(msg);
    });
  });
});
