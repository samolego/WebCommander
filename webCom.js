
/*****
The main Class
*****/

class Console {
  constructor(parent) {
    this.parentElement = document.getElementById(parent);
    
    var testElement = document.createElement("DIV");
    var testText = document.createTextNode("Test text");
    testElement.appendChild(testText);
    
    // Add content to the parent div
    this.parentElement.appendChild(testElement);
  }
}
