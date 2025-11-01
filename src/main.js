
const express = require('express');
const cors = require('cors');
var routes = require('./modules/routes')
const bodyParser = require('body-parser');

var app = express()      


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// RUTA PRINCIPAL
app.get('/', function(req, res) {
  res.status(200).send('¡Bienvenido a HealTest!');
})

// RUTAS DE LOS MODULOS
app.use('', routes)
 

module.exports = { app }