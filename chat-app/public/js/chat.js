const socket = io();

const messages = document.getElementById('messages');
const sidebar = document.getElementById('sidebar');
const sendBtn = document.getElementById('sendBtn');
const shareLocationBtn = document.getElementById('shareLocationBtn');
const msgInput = document.getElementById('msgInput');
const locationTemplate = document.getElementById('location-template').innerHTML;
const messageTemplate = document.getElementById('message-template').innerHTML;
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  const newMessage = messages.lastElementChild;

  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = messages.offsetHeight;

  const containerHeight = messages.scrollHeight;

  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset)
    messages.scrollTop = messages.scrollHeight;
};

socket.on('message', ({ username, text, createdAt }) => {
  const html = Mustache.render(messageTemplate, {
    username,
    text,
    createdAt: moment(createdAt).format('HH:mm'),
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('locationMessage', ({ username, url, createdAt }) => {
  const html = Mustache.render(locationTemplate, {
    username,
    url,
    createdAt: moment(createdAt).format('HH:mm'),
  });
  messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
});

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  sidebar.innerHTML = html;
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});

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
