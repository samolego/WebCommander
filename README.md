# WebComander
A simple and lightweight HTML + JS + CSS console imitation

# Get it now
Check out the (wiki)[https://github.com/samolego/WebComander/wiki]

# Usage:

### Include the JavaScript file:
```html
<html>
  <head>
    <script src="WebComander.js"></script>
  </head>
</html>
```
### Create a container:
Add a DIV element where you want the console.
```html
<div id="console"></div>
```

### Create the console:
Use this JS code to create a new console within the previously created DIV element.
```js
var myConsole = new WebComander.console('#console');
```
