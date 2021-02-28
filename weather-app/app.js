const request = require("postman-request");

const url =
  "http://api.weatherstack.com/current?access_key=29771b168609c1ce2b8a81d2fb63652d&query=Konya";

request({ url, json: true }, (error, response, body) => {
  console.log("Is is currently ", body.current.temperature);
});
