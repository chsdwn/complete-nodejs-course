const socket = io();
const sendBtn = document.getElementById('sendBtn');
const shareLocationBtn = document.getElementById('shareLocationBtn');
const msgInput = document.getElementById('msgInput');

socket.on('message', (msg) => console.log(msg));
socket.on('sendMessage', (msg) => console.log(msg));

sendBtn.addEventListener('click', () => {
  sendBtn.setAttribute('disabled', 'disabled');

  socket.emit('sendMessage', msgInput.value, (msg) => {
    sendBtn.removeAttribute('disabled');
    msgInput.value = '';
    msgInput.focus();

    console.log(msg);
  });
});

shareLocationBtn.addEventListener('click', () => {
  if (!navigator.geolocation)
    return alert('Your browser does not supports geolocation');

  shareLocationBtn.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit('sendLocation', { ltd: latitude, lng: longitude }, (msg) => {
      shareLocationBtn.removeAttribute('disabled');

      console.log(msg);
    });
  });
});
