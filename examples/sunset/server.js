// Main

// variables

const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//ressources

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/boxel_engine.html');
});

app.get('/css/boxel_engine.css', function (req, res) {
  res.sendFile(__dirname + '/css/boxel_engine.css');
});

app.get('/js/main.js', function (req, res) {
  res.sendFile(__dirname + '/js/main.js');
});

app.get('/js/utils.js', function (req, res) {
  res.sendFile(__dirname + '/js/utils.js');
});

app.get('/modules/gpu-browser.min.js', function (req, res) {
  res.sendFile(__dirname + '/modules/gpu-browser.min.js');
});

app.get('/modules/boxel_engine.js', function (req, res) {
  res.sendFile(__dirname + '/modules/boxel_engine.js');
});

server.listen(80, function() {
  console.log('listening on *:80');
});