const request = require('postman-request');

const url =
  'http://api.weatherstack.com/current?access_key=29771b168609c1ce2b8a81d2fb63652d&query=';

const getTemperature = (address, callback) => {
  request({ url: url + address, json: true }, (error, response, body) => {
    callback(body.current.temperature);
  });
};

module.exports = {
  getTemperature,
};
