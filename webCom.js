/*

WebComander

created by Samolego

single file version by pg008

*/

// Define the CSS
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML += ".console { \
    height: 165px; \
    overflow: auto; \
    background-color: black; \
    padding: 10px; \
    font-family: monospace; \
    font-size: large; \
}"

/*******************
The main Class
********************/

class Console {
  constructor(parent) {
    this.parentElement = document.getElementById(parent);
    
    var testElement = document.createElement("DIV");
    var testText = document.createTextNode("Test text");
    testElement.appendChild(testText);
    
    // Add content to the parent div
    this.parentElement.appendChild(testElement);
    
    // Create other HTML infrastructure
  }
  
  // All the JS code to be added here
  
}
