const socket = io();

const messages = document.getElementById('messages');
const sendBtn = document.getElementById('sendBtn');
const shareLocationBtn = document.getElementById('shareLocationBtn');
const msgInput = document.getElementById('msgInput');
const locationTemplate = document.getElementById('location-template').innerHTML;
const messageTemplate = document.getElementById('message-template').innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on('message', ({ text, createdAt }) => {
  const html = Mustache.render(messageTemplate, {
    text,
    createdAt: moment(createdAt).format('HH:mm'),
  });
  messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', ({ url, createdAt }) => {
  const html = Mustache.render(locationTemplate, {
    url,
    createdAt: moment(createdAt).format('HH:mm'),
  });
  messages.insertAdjacentHTML('beforeend', html);
});

socket.emit('join', { username, room });

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
