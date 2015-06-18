var express = require('express');
var router = express.Router();
var chatroomModule = require('../lib/chatroom.js');

module.exports = router;

router.use(function (req, res, next){
	next();
});


router.route('/:chatroom')
	.get(function (request, response){
		var roomName = request.params.chatroomModule;
		var messages = chatroomModule.readChatRoom(roomName);

  		response.json(messages);
	})
	.post(function (request, response){

		var newMessage = {
			name: request.body.name,
			message: request.body.message
		}

  		var chatroomName = request.params.chatroomModule;
  		var messages = chatroomModule.postMessage(newMessage, chatroomName);

  		response.json(messages);
	});

