# react-console  

Add a simple console pane to any app  

```javascript
var Console = require('react-console');

render() {
	return (
		<Console command={_this.command} toggle={this.toggleConsole} alive={this.state.log.alive} log={this.state.log}  />  
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
	log.message = '';
	log.doc = '';
	log.error = '';
	this.setState({log : log});
}

```  


### Push debug to `react-console`  
```javascript
// global
var debug = require('debug');

setInitialState() {
	debug.log = this.logger;
	...
}

// namespaced
var debug = require('debug');
var bugger = debug('react-console');

setInitialState() {
	bugger.log = this.logger;
	...
}
```
