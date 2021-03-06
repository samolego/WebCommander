# WebCommander

A simple and lightweight (~ 16 KB) JS console imitation.
[Check it out](https://samolego.github.io/WebCommander)

![webcommander](https://user-images.githubusercontent.com/34912839/91016715-7ae41800-e5ed-11ea-9ca7-7d7ddb0e9fcb.gif)

# Get it now
Check out the [wiki](https://github.com/samolego/WebComander/wiki)

# Usage

### Include the JavaScript file:
```html
<html>
  <head>
    <script src="webcommander.js"></script>
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
var myConsole = new WebCommander('console');
```
