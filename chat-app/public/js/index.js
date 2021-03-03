const usernameInput = document.getElementById('usernameInput');
const roomInput = document.getElementById('roomInput');
const joinBtn = document.getElementById('joinBtn');

joinBtn.addEventListener('click', () => {
  const url = `/chat.html?username=${usernameInput.value}&room=${roomInput.value}`;
  location.href = url;
});
