module.exports = {
	setDirectory: _setDirectory,
	getDirectory: _getDirectory,
	createRoom: _createRoom,
	readChatRoom: _readChatRoom,
	postMessage: _postMessage,
	getUserMessages: _getUserMessages
};

var fs = require('fs');
var path = require('path');

var _chatDirectory = null;

function _setDirectory(directoryPath){
	var directory = null;
	var dirPath = path.resolve(directoryPath)

	try {
		directory = fs.statSync(dirPath);
	} catch (err) {
		fs.mkdirSync(dirPath, 0777);
		directory = fs.statSync(dirPath);
	}

	var isDirectory = directory.isDirectory();

	if (isDirectory){
		_chatDirectory = directoryPath;
	}

	return isDirectory;
}

function _getDirectory(){
	return _chatDirectory;
}

function _createRoom(roomName){
	var messages = [];
	var filePath = path.resolve(_chatDirectory, roomName + ".json");
	fs.writeFileSync(filePath, JSON.stringify(messages));
	return messages;
}

function _readChatRoom(roomName, userName){
	var filePath = path.resolve(_chatDirectory, roomName + ".json");
	var fileString = null;
	var userMessages = [];

	if (userName !== undefined){
		fileString = fs.readFileSync(filePath).toString();
		var parseString = JSON.parse(fileString);
		userMessages = parseString.filter(function(message){
			return message.name === userName;
		});
		return userMessages;
		
	} else {
		try {
			fileString = fs.readFileSync(filePath).toString();
		} catch (err) {
			return _createRoom(roomName);
		}

		return JSON.parse(fileString);
	}
}

function _postMessage(message, roomName){
	var messages = _readChatRoom(roomName);

	var newMessage ={
		name: message.name,
		message: message.message,
		id: messages.length + 1,
		timestamp: new Date().toString()
	}
	messages.push(newMessage);

	var filePath = path.resolve(_chatDirectory, roomName + ".json");
	fs.writeFileSync(filePath, JSON.stringify(messages));

	return messages;
}

function _getUserMessages(userName){
	var filePath = fs.readdirSync(path.resolve(_chatDirectory));
	var userMsgArray = [];

	filePath.forEach(function(file){
		var roomName = file.slice(0, -5);
		var userMessages = _readChatRoom(roomName, userName);
		userMsgArray = userMsgArray.concat(userMessages);
	});
	return userMsgArray;
}

