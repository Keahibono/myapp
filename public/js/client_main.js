$body = $('body');
$form = $('<form>');
$messageDiv = $('<div>');
$room = $('<input id="room" placeholder="Room">');
$name = $('<input id="name" placeholder="Name">');
$message = $('<input id="message" placeholder="Message">');
$button = $('<button type="submit">Send Message</button>');
var allMessages;

$body.append($form, $messageDiv);
$form.append($room, $name, $message, $button);

$form.method = "POST";
$form.action = "http://localhost:3000/";

var name = "";
var message = "";
var room = "";


window.onload = function(){
  var request = new XMLHttpRequest();
  request.onload = function(){
    allMessages = this.response;
    appendMessageBoard(allMessages);
  };

  request.responseType = "json";
  request.open("GET", "http://localhost:3000/chatrooms/keahi", true);
  request.send();
};

function appendMessageBoard(){
  
  allMessages.forEach(function(message1){
    if(message1.hasOwnProperty('id')){
      var paragraph = document.createElement('p');
      paragraph.innerHTML = message1.room + ":   ";
      paragraph.innerHTML = message1.name +  ":   ";
      paragraph.innerHTML += message1.message;
      $messageDiv.append(paragraph);
    }
  });
}


$form.submit(function(event){
  event.preventDefault();
  _room = document.getElementById("room").value;
  _name = document.getElementById("name").value;
  _message = document.getElementById("message").value;

  var newMessage = {
    room: _room,
    name: _name,
    message: _message
  };
  submitMessage (newMessage);
});


function submitMessage(newMessage){
    var request = new XMLHttpRequest();
    request.onload = function(){
      newMessages = this.response;
      onlyAppend(newMessages);
    };
  
    request.responseType = 'json';
    request.open("POST", "http://localhost:3000/chatrooms/" + _room, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(newMessage));
  
}
   
setInterval(function(){
  var request = new XMLHttpRequest();
  request.onload = function(){
    newMessages = this.response;
    onlyAppend(newMessages);
  };

  request.responseType = "json";
  request.open("GET", "http://localhost:3000/", true);
  request.send();
}, 60000);
  
function onlyAppend (newMessages){
  var appendMessages = newMessages.filter(isNew);

  console.log(appendMessages);
  appendMessages.forEach(function(message1){
    if(message1.hasOwnProperty('id')){
      var paragraph = document.createElement('p');
      paragraph.innerHTML = message1.room + ":   ";
      paragraph.innerHTML = message1.name +  ":   ";
      paragraph.innerHTML += message1.message;
      $messageDiv.append(paragraph);
    }
  });
  allMessages = newMessages;
}

function isNew(message){
  if(message.id > allMessages.length){
    return true; 
  } else{
    return false;
  }
}
