/*

WebComander

created by Samolego

single file version by pg008

*/

// Define the CSS

window.onload = defineCss();

function defineCss() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML += ".console { \
        height: 165px; \
        overflow: auto; \
        background-color: black; \
        padding: 10px; \
        font-family: monospace; \
        font-size: large; \
    }";
    
    style.innerHTML += ".console-text { \
        caret-color: rgb(0, 255, 0); \
        color: rgb(0, 255, 0); \
        font-family: monospace; \
        font-size: large; \
    }";
    
    style.innerHTML += ".console-feedback-text { \
        color: #ccff33; \
    }";
    
    style.innerHTML += "::-webkit-scrollbar { \
        width: 6px; \
    } \
    ::-webkit-scrollbar-track { \
        border-radius: 0px; \
    } \
    ::-webkit-scrollbar-thumb { \
        background: #01802b; \
    } \
    ::-webkit-scrollbar-thumb:hover { \
        background: #073f02; \
    }";

    document.getElementsByTagName('head')[0].appendChild(style);
}

/*******************
The main Class
********************/

class Console {
  constructor(parent) {
    this.parentElement = document.getElementById(parent);
      
    // Focus the input field on click
    this.parentElement.onclick = function() {
        document.getElementById('consoleInputText').focus();
    } 
    
    // Create the main DIV
    this.consoleDiv = document.createElement("DIV");
    this.consoleDiv.id = "consoleDiv";
    this.consoleDiv.className = "console console-text";
    
    // Create the P for the content
    this.consoleText = document.createElement("P");
    this.consoleText.id = "consoleText";
    this.consoleText.innerHTML = "Welcome to WebComander";
    
    // Create the DIV for the response
    this.consoleLines = document.createElement("DIV");
    this.consoleLines.id = "consoleLines";
    
    // Create the SPAN for username
    this.consoleTyper = document.createElement("SPAN");
    this.consoleTyper.id = "consoleTyper";
    this.consoleTyper.innerHTML = "Username will be changed with js";
    
    // Create the input field
    this.consoleInputText = document.createElement("INPUT");
    this.consoleInputText.id = "consoleInputText";
    this.consoleInputText.type = "text";
    this.consoleInputText.className = "console-text";
    this.consoleInputText.style = "border: 0; outline: none; background-color: black;";
    this.consoleInputText.setAttribute("autocomplete", "off");
    this.consoleInputText.setAttribute("spellcheck", "false");
    
      
    this.consoleDiv.appendChild(this.consoleText);
    this.consoleDiv.appendChild(this.consoleLines);
    this.consoleDiv.appendChild(this.consoleTyper);
    this.consoleDiv.appendChild(this.consoleInputText);
    
    // Add content to the parent div
    this.parentElement.appendChild(this.consoleDiv);
    
   
	  
	  
	    var cmds = [
	{ command: "help", function: 'help' }, // 0
	{ command: "?", function: 'help' }, // 1
	{ command: "hide", function: 'consoleDiv.style.display = "none";' }, // 2
	{ command: "clear", function: 'this.consoleLines.innerHTML = null;' }, // 3
	{ command: "cd", function: 'cd' }, // 4
	{ command: "pwd", function: 'pwd' }, // 5
	{ command: "kill", function: 'kill' }, // 6
	{ command: "exit", function: 'kill' }, // 7
	{ command: "ping", function: 'this.consoleLines.append(this.newLine("pong", null));' }, // 8
	{ command: "extend", function: 'extend' }, // 9
	{ command: "shrink", function: 'shrink' }, // 10
	{ command: "sudo", function: 'sudo' }, // 11
	{ command: "su", function: 'su' } // 12
];

// Main map of commands
var cmdMap = new Map();

// Getting above declared commands to cmdMap
setCommands(cmds);


// Some variables
var consoleLines = this.consoleLines;
var consoleInput = this.consoleInputText;

// Commmand history
var selectedCmd = -1;
var usedCmds = [];

// Main console div
var consoleDiv;

var username = "user";
var hostname = "domain";


// Styling the username@hostname
var consoleTyper = this.consoleTyper;
consoleTyper.style.color = getUsernameColor();
consoleTyper.innerText = getUsername();

// This took to long to figure out ...
document.onkeydown = (evt) => this.consoleTyping(evt);


// Thanks to https://stackoverflow.com/questions/7060750/detect-the-enter-key-in-a-text-input-field
function consoleTyping(evt) { 
	var evt = (evt) ? evt : ((event) ? event : null); 
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);

	// Enter was pressed
	if ((evt.keyCode == 13) && (node.type=="text"))  {
		this.consoleDiv = this.consoleDiv;
		
		// Adding used command to console lines
		this.consoleLines.append(this.newLine("<span style='color:" + this.getUsernameColor() + ";'>" + this.getUsername() + "</span>" + this.consoleInput.value, "rgb(0, 255, 0)"));
		let c = this.consoleInput.value;
		if(c != "") {
			this.usedCmds.unshift(c);
			this.proccessCommand(c.toLowerCase().split(" "));
		}
		
		this.selectedCmd = -1;
		this.consoleInput.value = null;
		// Scrolling to bottom of console
		this.consoleDiv.scrollTop = this.consoleDiv.scrollHeight;

		// Changing colors and name (if superuser mode is active)
		consoleTyper.style.color = getUsernameColor();
		consoleTyper.innerText = getUsername();
	}

	// Up arrow was pressed
	else if((evt.keyCode == 38) && (node.type=="text")) {
		this.selectedCmd++;
		if(this.usedCmds[this.selectedCmd] != undefined)
			this.consoleInput.value = this.usedCmds[this.selectedCmd];
		else {
			this.consoleInput.value = "";
			this.selectedCmd < this.usedCmds.length ? this.selectedCmd++: this.selectedCmd = this.usedCmds.length;
		}
	}

	// Down arrow
	else if((evt.keyCode == 40) && (node.type=="text")) {
		this.selectedCmd--;
		if(this.usedCmds[this.selectedCmd] != undefined)
			this.consoleInput.value = this.usedCmds[this.selectedCmd];
		else {
			this.consoleInput.value = "";
			this.selectedCmd > 0 ? this.selectedCmd--: this.selectedCmd = -1;
		}
	}
}

// Main snake of the console - command parser
async function proccessCommand(cmd) {
	// Switch for recognising commands
	var commandFeedback = this.cmdMap.get(cmd[0]);
	if(commandFeedback != null) {
		cmd.shift();
		// Executing linked function
		try {
			eval(commandFeedback)(cmd);
	
		} catch(ignored) {
			// Function was not defined
		}
		return;
	}
	else {
		// Command was not found
		this.consoleLines.append(this.newLine(cmd[0] + " is not a valid command. Type \"help\" or \"?\" for available commands.", null));
		return;
	}
}

/**
 * Puts new commands to map of available commands
 * @param {*} commands an array of {command: "your_command", function: "functionToExecute"} elements
 */
function setCommands(commands) {
	commands.forEach((element) => {
		cmdMap.set(element.command, element.function);
	});
}


/**
 * Prints new line to console as feedback.
 * You should use this for command feedback.
 * @param {*} command text to put in console
 * @param {*} color css color of the text (e.g. "red" for alert)
 */
function newLine(command, color) {
	let response = document.createElement("span");
	if(color != null)
	response.style.color = color;
	else
	response.style.color = "#ccff33";
	response.innerHTML = command + "<br>";
	return response;
}

/**
 * Gets username @ hostname value
 * @returns text, e.g. "user@domain:~ $ "
 */
function getUsername() {
	if(this.sudoMode)
		return this.username + "@" + hostname + ":~ # ";
	return this.username + "@" + hostname + ":~ $ ";
}

/**
 * Gets username color depending on user perms
 * @returns color value, applicable to css style
 */
function getUsernameColor() {
	if(this.sudoMode)
		return "#75ffa5";
	return "white";
}


/* -=-=-=-=-=-= */

/* CONSOLE FUNCTIONS */
function help() {
	this.consoleLines.append(this.newLine("Available commands:", null));
	this.cmdMap.forEach((_value, key) => {
		this.consoleLines.append(key + ", ");
	});
	this.consoleLines.append(this.newLine("", null));
}

function cd(dir) {
	switch(dir[0]) {
		case "..":
			console.log(decodeURI(window.location.href));
			break;
		case ".":
			location.reload();
			break;
		default:
			window.location.href = cmd[0] + "/";
			break;
	}
}

function pwd() {
	console.log(decodeURI(location.href));
}

function kill() {
	if(!this.sudoMode) {
		this.consoleLines.append(this.newLine("Permission denied.", "red"));
		return;
	}
	let w = window.open("", "_self");
	w.document.write("");
	w.close();
}

function sudo(cmd) {
	// Running with sudo privilegies
	if(cmd[0] == "" || cmd[0] == null) {
		this.consoleLines.append(this.newLine("\"sudo\" requires a command after it.", null));
		return;
	}
	this.sudoMode = true;

	// We should warn the user about sudo being used
	this.consoleLines.append(this.newLine("<span style='color: #ff0f0f'>Warning! superuser mode used!</span>", null));
	this.consoleLines.append(this.newLine("<span style='color: #ffea00'>Great power comes with great responsibility.</span>", null));
	
	// Parsing the rest of the command
	proccessCommand(cmd);

	// Disabling superuser
	this.sudoMode = false;
}

function su(cmd) {
	// su - switching user
	if(cmd[0] == "" || cmd[0] == null) {
		this.username = "root";
	}
	else if(cmd[0] == "-" && cmd[1] != "" && cmd[1] != null) {
		this.username = cmd[1];
	}
	else
		this.consoleLines.append(this.newLine("Usage: <br> su - \"username\"", null));
	
	if(this.username == "root") {
		this.sudoMode = true;
		this.consoleLines.append(this.newLine("<span style='color: #ff0f0f'>Warning! Superuser mode active!</span>", null));
	}
	else
		this.sudoMode = false;
}


function extend() {
	this.consoleDiv.style.height = (window.innerHeight - 20).toString() + "px";
	this.consoleLines.append(this.newLine("Using extended mode.", null));
}

function shrink() {
	this.consoleDiv.style.height = "165px";
	this.consoleLines.append(this.newLine("Using shrinked mode.", null));
}
  }
}
