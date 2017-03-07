// socket connection to http server
var socket = io();
socket.on('message', console.dir);
socket.send('ping');

// display command results received from robot
socket.on('command result', (data)=>{
  console.dir(data);
  addMessage(data, false);
});

// render map data received from robot
socket.on('map data', (data)=>{
  console.dir(data);
  addShapeVoxels(data);
});

// render map data received from robot
socket.on('robot position', (pos)=>{
  console.dir(pos);
  moveRobotVoxel(pos);
});

// add functionality to command input field
var commandInput = document.getElementById('commandInput');
commandInput.addEventListener("keypress", (event)=>{
  if (event.keyCode == 13) {
    event.preventDefault();
    var baseText = event.target.value;
    var commandText = baseText;
    if (document.getElementById('runInTerminal').checked) {
      commandText = "runInTerminal('" + commandText + "')";
    }
    commandText = "return " + commandText;

    // display command
    addMessage(baseText, true);

    // send command to the web server
    socket.emit('command', commandText);

    // clear input text
    event.target.value = '';
  }
});

function addMessage(text, isInput) {
  var subClass = isInput ? 'input' : 'output';
  var element = document.createElement('div');
  element.appendChild(document.createTextNode(text));
  element.classList.add('message');
  element.classList.add(subClass);
  document.getElementById('messageContainer').insertBefore(element, commandInput);
  document.getElementById('messageContainer').insertBefore(document.createElement('br'), commandInput);
  if (isInput) {
    element.addEventListener('click', (event)=>{
      var commandInput = document.getElementById('commandInput');
      commandInput.value = event.target.firstChild.textContent;
      commandInput.focus();
    });
  }
}
