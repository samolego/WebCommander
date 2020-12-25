// Define the CSS

/**
 * Creates the style for the WebCommander terminal
 *
 * @author samolego (styles), pg008 (JS integration)
 */

window.onload = () => {
    let style = document.createElement('style');
    style.type = 'text/css';
	style.innerHTML = `
	.console {
		height: 165px;
		overflow: auto;
		background-color: black;
		padding: 10px;
		padding-bottom: 20px;
		font-family: 'Source Code Pro', monospace;
		font-size: large;
		border: 0px;
		outline: none;
		resize: none;
		word-wrap: break-word;
	}

	.console-text {
		caret-color: rgb(0, 255, 0);
		color: rgb(0, 255, 0);
		font-family: 'Source Code Pro', monospace;
		font-size: large;
	}

	.console-feedback-text {
		color: #ccff33;
	}

	.console-input {
		border: 0 !important;
		outline: none;
		background-color: black;
		width: 60%;
		resize: none;
	}

  	console-input:focus {
		outline: none !important;
		border: 0 !important;
	}
	  
	.hideBody {
		margin: 0;
		height: 100%;
		overflow: hidden;
	}
	.fullscreen {
		z-index: 9999; 
		width: 100%; 
		height: 100%; 
		position: fixed; 
		top: 0; 
		left: 0;
	}


	::-webkit-scrollbar {
		width: 6px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		border-radius: 0px;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: #01802b;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: #073f02;
	}

	`
    document.getElementsByTagName('head')[0].appendChild(style);
}

/*******************
The main Class
********************/

/**
 * Constructor of this class has been adapted from fork <a href="https://github.com/pg008/WebComander/blob/onefile/webCom.js">onefile</a>
 *
 * @author pg008 (class & constructor), samolego (methods)
 */
export class WebCommander {
  	constructor(parent) {

		// Whether input should be focused on clicking
		this.displayMode = false;

		// Used for nano
		this.editingFile = null;

		// Text that was copied
		this.copiedText = null;

		this.parentElement = document.getElementById(parent);
		this.parentElement.addEventListener('contextmenu', event => {
			paste(this);
			event.preventDefault();
		});
		
		// Create the main DIV
		this.consoleDiv = document.createElement("DIV");
		this.consoleDiv.className = "console console-text";
		
		// Create the P for the content
		this.consoleText = document.createElement("P");
		this.consoleText.innerHTML = "Welcome to WebComander";
		
		// Create the DIV for the response
		this.consoleLines = document.createElement("DIV");
		this.consoleLines.style.padding = "0px";
		
		// Create the SPAN for username
		this.consoleTyper = document.createElement("SPAN");

		// Create the input field
		this.consoleInput = document.createElement("INPUT");
		this.consoleInput.type = "text";
		this.consoleInput.className = "console-text console-input";
		this.consoleInput.autocomplete = "off";
		this.consoleInput.autocapitalize = "off";
		this.consoleInput.spellcheck = false;

		// Focus the input field on click
		this.parentElement.onclick = () => {
			if(!this.displayMode)
				this.consoleInput.focus();
			else
				this.consoleDisplayTextArea.focus();
		}
		
		this.consoleDiv.appendChild(this.consoleText);
		this.consoleDiv.appendChild(this.consoleLines);
		this.consoleDiv.appendChild(this.consoleTyper);
		this.consoleDiv.appendChild(this.consoleInput);
		
		// Add content to the parent div
		this.parentElement.appendChild(this.consoleDiv);

		// Declaring commands
		this.defaultCmds = [
			{ command: "help", function: 'this.help' },
			{ command: "?", function: 'this.help' },
			{ command: "hide", function: 'this.consoleDiv.style.display = "none"' },
			{ command: "clear", function: 'this.consoleLines.innerHTML = null' },
			{ command: "cd", function: 'cd' },
			{ command: "pwd", function: 'pwd' },
			{ command: "kill", function: 'kill' },
			{ command: "exit", function: 'kill' },
			{ command: "ping", function: 'this.writeLine("pong", null)' },
			{ command: "extend", function: 'extend' },
			{ command: "shrink", function: 'shrink' },
			{ command: "sudo", function: 'sudo' },
			{ command: "su", function: 'su' },
			{ command: "ls", function: 'ls' },
			{ command: "nano", function: 'nano' },
			{ command: "rm", function: 'rm' }
		];

		// Main map of commands
		this.AVAILABLE_COMMANDS_MAP = new Map();

		// Getting above declared commands to cmdMap
		this.setCommands(this.defaultCmds);

		// Commmand history
		this.selectedCmd = -1;
		this.usedCmds = [];

		// Other stuff
		this.sudoMode = false;
		this.username = "user";
		this.hostname = "domain";

		// Styling the "username@hostname"
		this.consoleTyper.style.color = this.getUsernameColor(this);
		this.consoleTyper.innerText = this.getUsername(this);



		// Editor for nano
		this.consoleDisplay = document.createElement("DIV");
		this.consoleDisplayTextArea = document.createElement("TEXTAREA");

		this.consoleDisplayTextArea.className = "console-text console-input";
		this.consoleDisplayTextArea.style = "width: 100%; font-size: small; height: auto;";
		this.consoleDisplayTextArea.autocomplete = "off";
		this.consoleDisplayTextArea.autocapitalize = "off";
		this.consoleDisplayTextArea.spellcheck = false;
		
		this.consoleDisplay.appendChild(this.consoleDisplayTextArea);


		// Auto copying text on selection
		document.onselectionchange = () => {
			var selection = window.getSelection().toString();
			if(selection != "") {
				this.copiedText = selection;
				document.execCommand("copy");
			}
		};

		// This took to long to figure out ...
		this.parentElement.onkeydown = (evt) => this.consoleTyping(evt);

	}

	// Thanks to https://stackoverflow.com/questions/7060750/detect-the-enter-key-in-a-text-input-field
	consoleTyping(evt) {
		evt = (evt) ? evt : ((event) ? event : null); 
		var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);

		// Enter was pressed
		if ((evt.key == "Enter") && (node.type=="text"))  {
			// Adding used command to console lines
			this.writeLine(
				`<span style='color: ${this.getUsernameColor(this)};'> ${this.getUsername(this)}</span>${this.consoleInput.value}`,
				"rgb(0, 255, 0)"
				);
			let c = this.consoleInput.value;
			if(c != "") {
				this.usedCmds.unshift(c);
				this.proccessCommand(c.split(" "));
			}
			
			this.selectedCmd = -1;
			this.consoleInput.value = null;
			// Scrolling to bottom of console
			this.consoleDiv.scrollTop = this.consoleDiv.scrollHeight;
		}

		// Up arrow was pressed
		else if(evt.key == "ArrowUp" && node.type=="text") {
			this.selectedCmd++;
			if(this.usedCmds[this.selectedCmd] != undefined)
				this.consoleInput.value = this.usedCmds[this.selectedCmd];
			else {
				this.consoleInput.value = "";
				this.selectedCmd < this.usedCmds.length ? this.selectedCmd++: this.selectedCmd = this.usedCmds.length;
			}
		}

		// Down arrow
		else if(evt.key == "ArrowDown" && node.type=="text") {
			this.selectedCmd--;
			if(this.usedCmds[this.selectedCmd] != undefined)
				this.consoleInput.value = this.usedCmds[this.selectedCmd];
			else {
				this.consoleInput.value = "";
				this.selectedCmd > 0 ? this.selectedCmd--: this.selectedCmd = -1;
			}
		}
		// ctrl + x
		else if((evt.ctrlKey || evt.metaKey) && evt.keyCode == 88 && this.displayMode) {
			exitNano(this);
		}
		else if(evt.key === "Escape") {
			shrink(this);
		}
	}


	// Main snake of the console - command parser
	async proccessCommand(cmd) {
		// Switch for recognising commands
		var commandFeedback = this.AVAILABLE_COMMANDS_MAP.get(cmd[0]);
		if(commandFeedback != null) {
			cmd.shift();
			// Executing linked function
			try {
				eval(commandFeedback)(this, cmd);
			} catch(ignored) {
				// Function was not defined or args were not passed over
			}
		}
		else
			// Command was not found
			this.writeLine(
				`${cmd[0]} is not a valid command. Type "help" or "?" for available commands.`,
				null
			);
	}

	/**
	 * Puts new commands to map of available commands
	 * @param {*} commands an array of {command: "your_command", function: "functionToExecute"} elements
	 */
	setCommands(commands) {
		for(let cmd in commands) {
			this.AVAILABLE_COMMANDS_MAP.set(commands[cmd].command, commands[cmd].function);
		}
	}

	/**
	 * Writes a line to the console.
	 *
	 * @param {*} command text to put in console
	 * @param {*} color css color of the text (e.g. "red" for alert)
	 */
	writeLine(command, color) {
		var response = document.createElement("SPAN");
		if(color != null)
			response.style.color = color;
		else
			response.style.color = "#ccff33";
		response.innerHTML = command.concat("<br>");

		this.consoleLines.append(response);
	}

	/**
	 * Gets "username@hostname" value, depending on sudo mode
	 * @returns text, e.g. "user@domain:~ $ "
	 */
	getUsername(self) {
		if(self.sudoMode)
			return self.username + "@" + self.hostname + ":~ # ";
		return self.username + "@" + self.hostname + ":~ $ ";
	}

	/**
	 * Gets username color depending on user perms
	 * @returns color value, applicable to css style
	 */
	getUsernameColor(self) {
		if(self.sudoMode)
			return "#75ffa5";
		return "white";
	}

	/* -=-=-=-=-=-=-=-=- */

	/* CONSOLE FUNCTIONS */
	help(self) {
		self.writeLine("Available commands:");
		var i = 0;
		self.AVAILABLE_COMMANDS_MAP.forEach((_f, cmd) => {
			i++;
			if(i != self.AVAILABLE_COMMANDS_MAP.size)
				self.consoleLines.append(cmd.concat(", "));
			else
				self.consoleLines.append(cmd);
		});
		self.writeLine("", null);
	}
}


// Global functions
// These are same for all consoles

async function cd(_self, dir) {
	var url = location.href;
	url = url.split("/");

	// Cutting away filename (e.g. index.html)
	if(url[url.length - 1].includes(".") || url[url.length - 1].includes("#")) {
		url.splice(url.length - 1, url.length);
	}

	// Spliting dir path by slashes
	dir = dir[0].split("/");

	// Creating new url
	var cutter = 1;
	for(var i = 0; dir.length > 0; i++) {
		if(dir[0].startsWith("..")) {
			url.splice(url.length - 1, url.length - 0);
		}
		else if(cutter >= dir.length) {
			break;
		}
		else if(dir[0] != "" && !dir[0].startsWith(".")) {
			cutter++;
		}
		dir.splice(cutter - 1, cutter);

	}
	// Navigating to the new URL
	url = url.join("/");
	if(!url.endsWith("/"))
		url = url.concat("/");
	url = url.concat(dir.join("/"));
	location.href = url;
}

async function pwd(self) {
	var url = location.href;
	url = url.split("/");
	url.splice(0, 3);
	self.writeLine(url.join("/"), null);
}

async function kill(self) {
	if(!self.sudoMode) {
		self.writeLine("Permission denied.", "red");
		return;
	}
	let w = window.open("", "_self");
	w.document.write("");
	w.close();
}

async function sudo(self, cmd) {
	// Running with sudo privilegies
	if(cmd[0] == "" || cmd[0] == null) {
		self.writeLine("\"sudo\" requires a command after it.", null);
		return;
	}
	self.sudoMode = true;

	// We should warn the user about sudo being used
	self.writeLine("<span style='color: #ff0f0f'>Warning! superuser mode used!</span>", null);
	self.writeLine("<span style='color: #ffea00'>Great power comes with great responsibility.</span>", null);

	// Parsing the rest of the command
	await self.proccessCommand(cmd);

	// Disabling superuser
	self.sudoMode = false;
}

async function su(self, cmd) {
	// su - switching user
	if(cmd[0] == "" || cmd[0] == null)
		self.username = "root";
	else if(cmd[0] == "-" && cmd[1] != "" && cmd[1] != null)
		self.username = cmd[1];
	else {
		self.writeLine("Usage: <br> su - \"username\"", null);
		return;
	}

	if(self.username == "root") {
		self.sudoMode = true;
		self.writeLine("<span style='color: #ff0f0f'>Warning! Superuser mode active!</span>", null);
	}
	else
		self.sudoMode = false;

	// Changing colors and name (if superuser mode is active)
	self.consoleTyper.style.color = self.getUsernameColor(self);
	self.consoleTyper.innerText = self.getUsername(self);
}

async function extend(self) {
	self.consoleDiv.classList.add("fullscreen");
	document.body.classList.add("hideBody");
	self.writeLine("Using extended mode.", null);
	try {
		const element = self.consoleDiv; 
		const requestFullScreen = element.requestFullscreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
		requestFullScreen.call(element);
	} catch(e) {
		// One of the fullscreen calls wasn't supported
	}
}

async function shrink(self) {
	self.consoleDiv.classList.remove("fullscreen");
	document.body.classList.remove("hideBody");
	self.writeLine("Using shrinked mode.", null);
	try {
		// Fullscreen exit
		const cancellFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
		cancellFullScreen.call(document);
	} catch(e) {
		// One of the fullscreen calls wasn't supported
	}
	self.consoleInput.focus();
}

async function nano(self, file) {
	file = file[0];
	
	let element = document.querySelectorAll(`[data-filename='${file}']`)[0];
	if(element == null) {
		// No element using this filename was found, creating new one
		self.writeLine(`Creating new file: ${file}`, "orange");

		// Creating new element
		let newFile = document.createElement("DIV");
		newFile.setAttribute("data-filename", file);
		document.body.appendChild(newFile);

		// Textarea for input
		self.consoleDisplayTextArea.value = null;
		self.consoleDisplayTextArea.style.height = "30px"
	}
	else {
		self.consoleDisplayTextArea.value = element.innerHTML;
	}


	// Setting the displayMode to prevent losing focus on click
	self.displayMode = true;
	self.editingFile = file;
	document.querySelector("data-" + file);

	self.consoleDisplayTextArea.focus();
	
	self.writeLine("GNU nano 0.0.1", null);
	self.writeLine(file, "blue");
	self.writeLine("", null);

	
	self.consoleDisplayTextArea.removeAttribute("readonly");

	//todo - height
	self.consoleLines.appendChild(self.consoleDisplayTextArea);

	self.writeLine("", null);
	self.writeLine(`<span style='background-color: white; color: black;' onclick="exitNano(${self})">^X</span> Exit`, "white");

	// Hiding typer and input
	self.consoleTyper.style.display = "none";
	self.consoleInput.style.display = "none";
}

async function exitNano(self) {
	// Showing the typer back
	self.consoleTyper.style.display = "";
	self.consoleInput.style.display = "";

	let edited = document.querySelectorAll(`[data-filename='${self.editingFile}']`)[0];
	edited.innerHTML = self.consoleDisplayTextArea.value;

	self.consoleDisplayTextArea.value = null;
	self.displayMode = false;

	self.consoleInput.focus();
}

async function rm(self, file) {
	file.forEach((f) => {
		let element = document.querySelectorAll(`[data-filename='${f}']`)[0];
		self.writeLine(`Removed ${f}`, "orange");
		element.remove();
	});
}

async function ls(self) {
	self.writeLine("Available files: ", null);
	for(let element of document.querySelectorAll("[data-filename]")) {
		self.writeLine(element.getAttribute("data-filename"), "green");
	}
}

// Pasting on right-click
async function paste(self) {
	// Pasting to textarea or input
	if(self.copiedText == null) {
		return;
	}
	else if(self.displayMode) {
		self.consoleDisplayTextArea.focus();
		self.consoleDisplayTextArea.value += self.copiedText
	}
	else {
		self.consoleInput.focus();
		self.consoleInput.value += self.copiedText
	}
}
