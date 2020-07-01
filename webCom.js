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
    
    // Create other HTML infrastructure
  }
  
  // All the JS code to be added here
  
}
