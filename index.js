var bodyParser = require('body-parser');
var express = require('express');

var resource = require('./routes/resource.js');
var action = require('./routes/action.js');
var table = require('./routes/table.js');

var PORT = 3000;
var app = express();

app.use(bodyParser.json());
app.use(require('body-parser').urlencoded({ extended: true }))
resource.setApp(app,express);
table.setApp(app);
action.setApp(app);

app.listen(PORT, function () {
  console.log('Listening on port', PORT)
})
