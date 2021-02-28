console.log('Client side javascript file loaded');

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const temperature = document.getElementById('temperature');
const error = document.getElementById('error');

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const location = search.value;

  fetch(
    'http://api.weatherstack.com/current?access_key=29771b168609c1ce2b8a81d2fb63652d&query=' +
      location,
  ).then((response) => {
    response.json().then((data) => {
      if (data.error) error.textContent = data.error;
      else temperature.textContent = data.current.temperature;
    });
  });
});
