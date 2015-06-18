var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');
var path = require('path')

var chatModule = require('../app/lib/chatroom.js');

describe('chatModule', function () {
		it('should create Directory if none exists', function () {
			expect(chatModule.setDirectory('./test/temp')).to.be.true;

			try{
				fs.rmdirSync(path.resolve('./test/temp'));
			} catch (err){
				//file does not exist
				console.log("ERRROR in catch");
			}
		});

		it('should know where to find chatrooms', function(){					//Where
			expect(chatModule.setDirectory('./test/test_data')).to.be.true;
			//expect(chatModule.getDirectoy()).to.be.equal('.test/test_data');
			expect(chatModule.getDirectory(), 'directory was not set').to.equal('./test/test_data');
		});

	it('should be able to create a room or JSON file', function(){			//Can or No Can?
		var messages = chatModule.createRoom('baconRoom');

		expect(messages).to.be.an.instanceof(Array);
		expect(messages).to.have.length(0);
		fs.existsSync('./test/test_data/baconRoom.json', function (exists){
			expect(exists, 'baconRoom.json file does not exist').to.be.true;
		});
	});

	it('should create a new JSON if the chatroom does not exists', function () {
		expect(chatModule.readChatRoom('tempChatroom')).to.deep.equal([]);
		fs.unlinkSync(path.resolve('./test/test_data/tempChatroom.json'));
	});

	it('should be able to get all messages from chatroom', function(){
		expect(chatModule.readChatRoom('baconRoom')).to.deep.equal([]);
	});

	it('should be able to post a message to a chatroom that does not exist', function () {
		var message = {
			name: "Anon",
			message: "Good Bye"
		};

		var messages = chatModule.postMessage(message, 'tempChatroom');
		
		expect(messages).to.be.an.instanceof(Array)
		expect(messages).to.have.length(1);
		fs.unlinkSync(path.resolve('./test/test_data/tempChatroom.json'));
	});

	it('should post a message to a chat room', function(){
		var firstMessage = {
			name: "Bob",
			message: "Hello"
		};

		var secondMessage = {
			name: "Keahi",
			message: "Hi. My Name Is"
		};

		var messages = chatModule.postMessage(firstMessage, 'baconRoom');

		expect(messages).to.be.an.instanceof(Array);
		expect(messages).to.have.length(1);
		expect(messages[0]).to.have.property('name', 'Bob');
		expect(messages[0]).to.have.property('message', 'Hello');
		expect(messages[0]).to.have.property('id', 1);
		expect(messages[0]).to.have.property('timestamp');	
		expect(messages).to.deep.equal(chatModule.readChatRoom('baconRoom'));

		messages = chatModule.postMessage(secondMessage, 'baconRoom');

		expect(messages).to.be.an.instanceof(Array);
		expect(messages).to.have.length(2);
		expect(messages[1]).to.have.property('name', 'Keahi');
		expect(messages[1]).to.have.property('message', 'Hi. My Name Is');
		expect(messages[1]).to.have.property('id', 2);
		expect(messages[1]).to.have.property('timestamp');	
		expect(messages).to.deep.equal(chatModule.readChatRoom('baconRoom'));
	});

	it('should get all messages for a specific user', function(){
		expect(chatModule.readChatRoom('baconRoom', 'Keahi')).to.have.length(1);
	});

	it('should get all messages for a specific user accross all chatrooms', function () {
		expect(chatModule.getUserMessages('Keahi')).to.have.length(1);

		var message = {
		name: "Keahi",
		message: "Ohhhh yeaaah"
		};

		messages = chatModule.postMessage(message, 'baconRoom');
		expect(chatModule.getUserMessages('Keahi')).to.have.length(2);

		messages = chatModule.postMessage(message, 'tempChatroom');
		expect(chatModule.getUserMessages('Keahi')).to.have.length(3);

		fs.unlinkSync(path.resolve('./test/test_data/tempChatroom.json'));
	});
});