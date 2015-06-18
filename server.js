var config = require('./config.json');
var express = require('express');

var bodyParser = require('body-parser');

var app = express();

var chatroom = require('./app/lib/chatroom.js');
chatroom.setDirectory('./app/data/chatrooms');

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());

//require the chatroom/users routes
app.use('/chatrooms', require('./app/routes/chatrooms.js'));
app.use('/users', require('./app/routes/users.js'));

app.get('/', function (request, response){
	response.render('index', {name: 'NAME'});   ///WTF???
});

var server = app.listen(config.port);