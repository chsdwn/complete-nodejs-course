const express = require('express');
const path = require('path');
const hbs = require('hbs');
const forecast = require('./utils/forecast');

const app = express();

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Hulusi',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address',
    });
  }

  forecast.getTemperature(req.query.address, (temperature) => {
    console.log('temperature', temperature);
    res.send({
      address: req.query.address,
      temperature,
    });
  });
});

app.get('/weather/*', (req, res) => {
  res.send('Weather Not Found');
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    });
  }

  res.send({
    products: [],
  });
});

app.get('*', (req, res) => {
  res.render('404');
});

app.listen(3000, () => {
  console.log('Listening 3000');
});
