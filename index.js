var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var KEY = require('./constants').KEY;
var _ = require('lodash');
var sendTextMessage = require('./functions').sendTextMessage;

app.use(bodyParser.urlencoded());

app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === KEY) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) {
    console.log(JSON.stringify(req.body));
  var messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      var text = event.message.text;
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});
