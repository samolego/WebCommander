// Define the CSS

/**
 * Creates the style for the WebCommander terminal
 *
 * @author samolego (styles), pg008 (JS integration)
 */


var isMobile = true;

window.onload = () => {
    let style = document.createElement('style');
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
  	console-input:focus {
    		outline: none;
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

// Thanks to https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
function mobileAndTabletCheck() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}


/*******************
The main Class
********************/

/**
 * Constructor of this class has been adapted from fork <a href="https://github.com/pg008/WebComander/blob/onefile/webCom.js">onefile</a>
 *
 * @author pg008 (class & constructor), samolego (methods)
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
		this.consoleInput = document.createElement("SPAN");
    		this.consoleInput.setAttribute("tabindex", "0");
    		this.consoleInput.className = "console-input";
		this.inputValue = "";
  		this.inputStringIndex = 0;
		this.consoleInput.innerHTML = "&block;";
		
		
		// Hidden input field for mobile devices
		isMobile = mobileAndTabletCheck();
		if (isMobile) {
			this.consoleHiddenInput = document.createElement("INPUT");
			this.consoleHiddenInput.style.position = "relative";
			this.consoleHiddenInput.style.top = "-50px";
			this.consoleHiddenInput.style.opacity = 1;
		}
		
		// Focus the input field on click
		this.parentElement.onclick = () => {
			if (!isMobile)
				this.consoleInput.focus();
			else
				this.consoleHiddenInput.focus();
		}

		this.consoleDiv.appendChild(this.consoleText);
		this.consoleDiv.appendChild(this.consoleLines);
		this.consoleDiv.appendChild(this.consoleTyper);
		this.consoleDiv.appendChild(this.consoleInput);
		
		if (isMobile)
			this.consoleDiv.appendChild(this.consoleHiddenInput);
		
		// Add content to the parent div
		this.parentElement.appendChild(this.consoleDiv);

		// Declaring commands
		//todo move most of these to global
		this.defaultCmds = [
			{ command: "help", function: 'this.help' }, // 0
			{ command: "?", function: 'this.help' }, // 1
			{ command: "hide", function: 'this.consoleDiv.style.display = "none"' }, // 2
			{ command: "clear", function: 'this.consoleLines.innerHTML = null' }, // 3
			{ command: "cd", function: 'cd' }, // 4
			{ command: "pwd", function: 'pwd' }, // 5
			{ command: "kill", function: 'kill' }, // 6
			{ command: "exit", function: 'kill' }, // 7
			{ command: "ping", function: 'this.writeLine("pong", null)' }, // 8
			{ command: "extend", function: 'extend' }, // 9
			{ command: "shrink", function: 'shrink' }, // 10
			{ command: "sudo", function: 'sudo' }, // 11
			{ command: "su", function: 'su' } // 12
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

		// Typing detection
		this.consoleInput.onkeypress = (evt) => this.consoleTyping(evt);
    		this.consoleInput.onkeydown = (evt) => this.checkKeyCode(evt);
		
		if (isMobile) {
    			this.consoleHiddenInput.onkeyup = (evt) => this.checkKeyCode(evt);	
		}

	}

	// Thanks to https://stackoverflow.com/questions/7060750/detect-the-enter-key-in-a-text-input-field
	consoleTyping(evt) {
    		if (!(evt.keyCode == 38 || evt.keyCode == 40 || evt.keyCode == 37 || evt.keyCode == 39 || evt.keyCode == 8  || evt.keyCode == 46)) {
  			evt = (evt) ? evt : ((event) ? event : null);
  			var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);


				// Enter was pressed
				if (evt.keyCode == 13)  {
					// Adding used command to console lines
					this.writeLine(
						`<span style='color: ${this.getUsernameColor(this)};'> ${this.getUsername(this)}</span>${this.inputValue}`,
						"rgb(0, 255, 0)"

					);
					var c = this.inputValue;
					if(c != "") {
						this.usedCmds.unshift(c);
						this.proccessCommand(c.toLowerCase().split(" "));
					}

					this.selectedCmd = -1;
					this.inputValue = "";
					this.inputStringIndex = 0;
					this.redrawInput();
					// Scrolling to bottom of console
					this.consoleDiv.scrollTop = this.consoleDiv.scrollHeight;
				}

		      		else {
					var char = String.fromCharCode(evt.keyCode);
					this.addCharacter(char);
		     		}
    			}
  		}

  // Check if an arrow key or backspace or delete was pressed
  // Arrow keys, backspace, delete don't work for the onkeypress event handler
  checkKeyCode(evt) {
    if (evt.keyCode == 38 || evt.keyCode == 40 || evt.keyCode == 37 || evt.keyCode == 39 || evt.keyCode == 8  || evt.keyCode == 46) {
      this.nonCharKey(evt);
    }
    if (isMobile) {
	    alert("input");
	    this.addCharacter(consoleHiddenInput.value);
	    this.consoleHiddenInput.value = "";
    	}
  }

  nonCharKey(evt) {

    // prevent scrolling on arrow keys
    evt.preventDefault();

    
    // Up arrow was pressed
		if(evt.keyCode == 38) {
			this.selectedCmd++;
			if(this.usedCmds[this.selectedCmd] != undefined)
				this.inputValue = this.usedCmds[this.selectedCmd];
			else {
				this.inputValue = "";
				this.selectedCmd < this.usedCmds.length ? this.selectedCmd++: this.selectedCmd = this.usedCmds.length;
			}
      this.inputStringIndex = this.inputValue.length;
      this.redrawInput();
		}

		// Down arrow
		else if(evt.keyCode == 40) {
			this.selectedCmd--;
			if(this.usedCmds[this.selectedCmd] != undefined)
				this.inputValue = this.usedCmds[this.selectedCmd];
			else {
				this.inputValue = "";
				this.selectedCmd > 0 ? this.selectedCmd--: this.selectedCmd = -1;
			}
      this.inputStringIndex = this.inputValue.length;
      this.redrawInput();
		}

    // Left arrow
	else if (evt.keyCode == 37) {
     if (this.inputStringIndex >= 1) {
  		  this.inputStringIndex -= 1;
        this.redrawInput();
      }
		}

    // Right arrow
		else if (evt.keyCode == 39) {
      if (this.inputStringIndex < this.inputValue.length) {
  		  this.inputStringIndex += 1;
        this.redrawInput();
      }
		}

    // Backspace
    else if (evt.keyCode == 8) {
      this.removeCharacter();
    }

    // Delete
    else if (evt.keyCode == 46) {
      this.deleteCharacter();
    }
  }

  addCharacter(char) {
    var temp = [this.inputValue.slice(0, this.inputStringIndex), char, this.inputValue.slice(this.inputStringIndex)].join('');
    this.inputValue = temp;
    this.inputStringIndex += 1;
    this.redrawInput();
  }
  removeCharacter() {
    if (this.inputStringIndex >= 1) {
      var temp = [this.inputValue.slice(0, this.inputStringIndex - 1), this.inputValue.slice(this.inputStringIndex)].join('');
      this.inputValue = temp;
      this.inputStringIndex -= 1;
      this.redrawInput();
    }
  }
  deleteCharacter() {
    if (this.inputStringIndex <= this.inputValue.length) {
      var temp = [this.inputValue.slice(0, this.inputStringIndex), this.inputValue.slice(this.inputStringIndex + 1)].join('');
      this.inputValue = temp;
      this.redrawInput();
    }
  }

  redrawInput() {
    this.consoleInput.innerHTML = this.inputValue.substr(0, this.inputStringIndex) + '&block;' + this.inputValue.substr(this.inputStringIndex + 1);
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
		self.AVAILABLE_COMMANDS_MAP.forEach((_f, c) => {
			self.consoleLines.append(c.concat(", "));
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
	console.log(this);
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
	self.consoleDiv.style.height = (window.innerHeight - 20).toString() + "px";
	self.writeLine("Using extended mode.", null);
}

async function shrink(self) {
	self.consoleDiv.style.height = "165px";
	self.writeLine("Using shrinked mode.", null);
}
