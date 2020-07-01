// Define the CSS

window.onload = defineCss();

function defineCss() {
    var style = document.createElement('style');
    style.type = 'text/css';
	style.innerHTML = `
	.console {
		height: 165px;
		overflow: auto;
		background-color: black;
		padding: 10px;
		font-family: monospace;
		font-size: large;
	}
	.console-text {
		caret-color: rgb(0, 255, 0);
		color: rgb(0, 255, 0);
		font-family: monospace;
		font-size: large;
	}
	.console-feedback-text {
		color: #ccff33;
	}
	.console-input {
		border: 0;
		outline: none;
		background-color: black;
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
 * This class has been adapted from fork <a href="https://github.com/pg008/WebComander/blob/onefile/webCom.js">onefile</a>
 * 
 * @author pg008
 */
class WebCommander {
  	constructor(parent) {
		this.parentElement = document.getElementById(parent);
		
		// Create the main DIV
		this.consoleDiv = document.createElement("DIV");
		this.consoleDiv.className = "console console-text";
		
		// Create the P for the content
		this.consoleText = document.createElement("P");
		this.consoleText.innerHTML = "Welcome to WebComander";
		
		// Create the DIV for the response
		this.consoleLines = document.createElement("DIV");
		
		// Create the SPAN for username
		this.consoleTyper = document.createElement("SPAN");
		
		// Create the input field
		this.consoleInput = document.createElement("INPUT");
		this.consoleInput.type = "text";
		this.consoleInput.className = "console-text console-input";
		this.consoleInput.setAttribute("autocomplete", "off");
		this.consoleInput.setAttribute("spellcheck", "false");

		// Focus the input field on click
		this.parentElement.onclick = () => {
			this.consoleInput.focus();
		}
		
		this.consoleDiv.appendChild(this.consoleText);
		this.consoleDiv.appendChild(this.consoleLines);
		this.consoleDiv.appendChild(this.consoleTyper);
		this.consoleDiv.appendChild(this.consoleInput);
		
		// Add content to the parent div
		this.parentElement.appendChild(this.consoleDiv);

		// Declaring commands
		this.defaultCmds = [
			{ command: "help", function: 'this.help' }, // 0
			{ command: "?", function: 'this.help' }, // 1
			{ command: "hide", function: 'this.consoleDiv.style.display = "none";' }, // 2
			{ command: "clear", function: 'this.consoleLines.innerHTML = null;' }, // 3
			{ command: "cd", function: 'this.cd' }, // 4
			{ command: "pwd", function: 'this.pwd' }, // 5
			{ command: "kill", function: 'this.kill' }, // 6
			{ command: "exit", function: 'this.kill' }, // 7
			{ command: "ping", function: 'this.consoleLines.append(this.newLine("pong", null));' }, // 8
			{ command: "extend", function: 'this.extend' }, // 9
			{ command: "shrink", function: 'this.shrink' }, // 10
			{ command: "sudo", function: 'this.sudo' }, // 11
			{ command: "su", function: 'this.su' } // 12
		];

		// Main map of commands
		this.AVAILABLE_COMMANDS_MAP = new Map();

		// Getting above declared commands to cmdMap
		this.setCommands(this.defaultCmds);

		// Commmand history
		this.selectedCmd = -1;
		this.usedCmds = [];

		this.username = "user";
		this.hostname = "domain";

		// Styling the "username@hostname"
		this.consoleTyper.style.color = this.getUsernameColor();
		this.consoleTyper.innerText = this.getUsername();

		
		// This took to long to figure out ...
		this.consoleInput.onkeydown = (evt) => this.consoleTyping(evt);
	}

	// Thanks to https://stackoverflow.com/questions/7060750/detect-the-enter-key-in-a-text-input-field
	consoleTyping(evt) { 
		evt = (evt) ? evt : ((event) ? event : null); 
		var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);

		// Enter was pressed
		if ((evt.keyCode == 13) && (node.type=="text"))  {
			// Adding used command to console lines
			this.consoleLines.append(
				this.newLine(
					`<span style='color: ${this.getUsernameColor()};'> ${this.getUsername()}</span>${this.consoleInput.value}`,
					"rgb(0, 255, 0)"
					)
				);
			let c = this.consoleInput.value;
			if(c != "") {
				this.usedCmds.unshift(c);
				this.proccessCommand(c.toLowerCase().split(" "));
			}
			
			this.selectedCmd = -1;
			this.consoleInput.value = null;
			// Scrolling to bottom of console
			this.consoleDiv.scrollTop = this.consoleDiv.scrollHeight;
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
	async proccessCommand(cmd) {
		// Switch for recognising commands
		var commandFeedback = this.AVAILABLE_COMMANDS_MAP.get(cmd[0]);
		if(commandFeedback != null) {
			cmd.shift();
			// Executing linked function
			try {
				eval(commandFeedback)(cmd);
		
			} catch(ignored) {
				// Function was not defined
				console.log(ignored);
			}
			return;
		}
		else
			// Command was not found
			this.consoleLines.append(
				this.newLine(
					`${cmd[0]} is not a valid command. Type "help" or "?" for available commands.`, 
					null
				)
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
	 * Generates new text line as feedback for console.
	 * You should use this for command feedback.
	 * @param {*} command text to put in console
	 * @param {*} color css color of the text (e.g. "red" for alert)
	 */
	newLine(command, color) {
		let response = document.createElement("SPAN");
		if(color != null)
			response.style.color = color;
		else
			response.style.color = "#ccff33";
		response.innerHTML = command.concat("<br>");
		return response;
	}

	/**
	 * Gets "username@hostname" value, depending on sudo mode
	 * @returns text, e.g. "user@domain:~ $ "
	 */
	getUsername() {
		if(this.sudoMode)
			return this.username + "@" + this.hostname + ":~ # ";
		return this.username + "@" + this.hostname + ":~ $ ";
	}

	/**
	 * Gets username color depending on user perms
	 * @returns color value, applicable to css style
	 */
	getUsernameColor() {
		if(this.sudoMode)
			return "#75ffa5";
		return "white";
	}


	/* -=-=-=-=-=-= */

	/* CONSOLE FUNCTIONS */
	help() {
		console.log(consoleLines);
		this.consoleLines.append(this.newLine("Available commands:", null));
		for(let c in this.AVAILABLE_COMMANDS_MAP) {
			this.consoleLines.append(AVAILABLE_COMMANDS_MAP[c].key + ", ");
		}
		
		this.consoleLines.append(this.newLine("", null));
	}

	cd(dir) {
		var url = location.href;
		url = url.split("/");

		// Cutting away filename (e.g. index.html)
		if(url[url.length - 1].includes(".")) {
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

	pwd() {
		var url = location.href;
		url = url.split("/");
		url.splice(0, 3);
		this.consoleLines.append(this.newLine(url.join("/"), null));
	}

	kill() {
		if(!this.sudoMode) {
			this.consoleLines.append(this.newLine("Permission denied.", "red"));
			return;
		}
		let w = window.open("", "_self");
		w.document.write("");
		w.close();
	}

	sudo(cmd) {
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
		this.proccessCommand(cmd);

		// Disabling superuser
		this.sudoMode = false;
	}

	su(cmd) {
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
		// Changing colors and name (if superuser mode is active)
		consoleTyper.style.color = getUsernameColor();
		consoleTyper.innerText = getUsername();
	}

	extend() {
		this.consoleDiv.style.height = (window.innerHeight - 20).toString() + "px";
		this.consoleLines.append(this.newLine("Using extended mode.", null));
	}

	shrink() {
		this.consoleDiv.style.height = "165px";
		this.consoleLines.append(this.newLine("Using shrinked mode.", null));
	}
  
}
