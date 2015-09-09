# react-console  

Add a simple console pane to any app  

```javascript
var Console = require('react-console');

... React Class ...

render() {
	return (
		<Console command={this.command} toggle={this.toggleConsole} alive={this.state.log.alive} log={this.state.log}  />  
	);
},
command(value) {
	// value is text box value
},
toggleConsole(e) {
	this.setState({ log: {alive: !this.state.log.alive} });
},
openConsole() {
	this.setState({ log: {alive: true} });
},
logger(data) {
	var log = this.state.log;
	
	// make sure to erase/overwrite any current entries
	log.message = data.message || ''; // String or Array of Strings 
	log.doc = data.doc || ''; // Object or Array of Objects
	log.error = data.error || ''; // String or Array of Strings
	
	this.setState({log : log});
},
debugLogger(msg) {
	var log = this.state.log;
	
	// make sure to erase/overwrite any current entries
	log.message = msg; 
	log.doc = ''; 
	log.error = '';
	
	this.setState({log : log});
}

... end React Class ...

```  


### Push debug to `react-console`  
```javascript
// global
var debug = require('debug');

... React Class ...
setInitialState() {
	debug.log = this.debugLogger;
	...
}

// namespaced
var debug = require('debug');
var bugger = debug('react-console');

... React Class ...
setInitialState() {
	bugger.log = this.debugLogger;
	...
}
```
