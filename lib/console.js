'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var _ = require('lodash');
var Draggable = require('react-draggable');

var debug = require('debug')('react-console');

var Console = React.createClass({
	displayName: 'Console',

	getInitialState: function getInitialState() {
		var props = this.props.log;
		var msg = _.isArray(props.messages) ? props.messages : props.messages ? [props.messages] : [];
		var doc = _.isArray(props.docs) ? props.docs : props.docs ? [props.docs] : [];
		var err = _.isArray(props.error) ? props.error : props.error ? [props.error] : [];

		this._cache;
		this._repeat = 1;
		this._sync = 0;
		this._ui = {};

		return {
			log: msg.concat(doc, err),
			alive: props.alive,
			fullscreen: false
		};
	},
	componentWillReceiveProps: function componentWillReceiveProps(props) {
		debug('console received props', props);
		var _this = this;
		if (props.alive !== this.state.alive) {
			_this.setState({ alive: props.alive });
		}

		var logs = props.log;

		// object
		var docs = _.isArray(logs.doc) ? logs.doc : logs.doc ? [logs.doc] : [];
		_.each(docs, function (m) {
			var push = _this.state.log;
			try {
				var mm = JSON.stringify(m, null, 4);
			} catch (e) {
				var mm = 'doc not parsed';
			}
			if (mm && mm !== _this._cache) {
				push.push(React.createElement(
					'pre',
					null,
					mm
				));
				_this.setState({ log: push });
				_this._repeat = 1;
			} else {
				_this._repeat++;
				_this._sync++;
				if (_this._repeat > 4 && _this._repeat % 5 === 0) {
					_this._sync--;
					push.push(React.createElement(
						'pre',
						null,
						mm
					));
					push.push(React.createElement(
						'div',
						{ className: 'repeatlog' },
						'Log entry below repeated ',
						_this._repeat,
						' times'
					));
					_this.setState({ log: push });
				}
			}

			_this._cache = mm;
		});

		// error
		var error = _.isArray(logs.error) ? logs.error : logs.error ? [logs.error] : [];
		_.each(error, function (m) {
			var push = _this.state.log;
			if (m && m !== _this._cache) {
				push.push(React.createElement('div', { className: 'bg-danger', dangerouslySetInnerHTML: { __html: m } }));
				_this.setState({ log: push });
				_this._repeat = 1;
			} else {
				_this._repeat++;
				_this._sync++;
				if (_this._repeat > 4 && _this._repeat % 5 === 0) {
					_this._sync--;
					push.push(React.createElement('div', { className: 'bg-danger', dangerouslySetInnerHTML: { __html: m } }));
					push.push(React.createElement(
						'div',
						{ className: 'repeatlog' },
						'Log entry below repeated ',
						_this._repeat,
						' times'
					));
					_this.setState({ log: push });
				}
			}

			_this._cache = m;
		});

		// standard message
		var msg = _.isArray(logs.message) ? logs.message : logs.message ? [logs.message] : [];
		_.each(msg, function (m) {
			var push = _this.state.log;
			if (m && m !== _this._cache) {
				push.push(React.createElement('div', { dangerouslySetInnerHTML: { __html: m } }));
				_this.setState({ log: push });
				_this._repeat = 1;
			} else {
				_this._repeat++;
				_this._sync++;
				if (_this._repeat > 4 && _this._repeat % 5 === 0) {
					_this._sync--;
					push.push(React.createElement('div', { dangerouslySetInnerHTML: { __html: m } }));
					push.push(React.createElement(
						'div',
						{ className: 'repeatlog' },
						'Log entry below repeated  ',
						_this._repeat,
						' times'
					));
					_this.setState({ log: push });
				}
			}

			_this._cache = m;
		});

		// clean up the log array
		if (this.state.log.length > 500) {
			this.setState({ log: this.state.log.splice(0, 200) });
		}
	},
	handleStop: function handleStop(event, ui) {
		this._ui = ui.position;
	},
	render: function render() {

		var _this = this;
		if (_.isArray(this.state.log) && this.state.log.length > 0) {

			var rev = this.state.log;
			var num = _this._sync;
			var map = rev.map(function (entry, k) {
				num++;
				return React.createElement(
					'div',
					{ className: 'clearfix', key: k },
					React.createElement(
						'div',
						{ className: 'col-sm-1' },
						num
					),
					React.createElement(
						'div',
						{ className: 'col-sm-11' },
						entry
					)
				);
			}).reverse();
		} else {
			var map = React.createElement('span', null);
		}

		var cmd = this.props.alive ? React.createElement(
			'div',
			{ className: 'col-sm-8 no-padding' },
			React.createElement(
				'form',
				{ onSubmit: this.command },
				React.createElement(
					'div',
					{ className: 'col-sm-10 no-padding' },
					React.createElement('input', { type: 'text', ref: 'console', className: 'form-control' })
				),
				React.createElement(
					'div',
					{ className: 'col-sm-2  no-padding' },
					React.createElement(
						'a',
						{ href: '#', onClick: this.command, className: 'btn btn-sm btn-info ' },
						'Emit'
					)
				)
			)
		) : React.createElement(
			'div',
			{ className: 'col-sm-8 ' },
			React.createElement('span', null)
		);

		var clear = this.props.alive ? React.createElement(
			'span',
			null,
			React.createElement(
				'a',
				{ title: 'Erase console', href: '#', onClick: this.clear, className: 'btn btn-sm btn-danger pull-right' },
				React.createElement('span', { className: 'glyphicon glyphicon-erase' })
			)
		) : React.createElement('span', null);

		var classy = " console no-padding ";
		var add = this._ui.top ? { start: { x: this._ui.left, y: this._ui.top } } : {};
		debug(add);
		if (!this.props.alive) {
			classy += ' close ';
			if (this._ui.top) add = { start: { x: 0, y: 0 } };
		} else if (this.state.fullscreen) {
			classy += ' fullscreen ';
			add = { start: { x: 0, y: 0 } };
		}

		var minimize = this.props.alive ? React.createElement(
			'a',
			{ title: 'minimize console', href: '#', onClick: this.toggle, className: 'btn btn-sm btn-default pull-right' },
			React.createElement('span', { className: 'glyphicon glyphicon-minus' })
		) : React.createElement('span', null);

		var maximize;
		var move = React.createElement('span', null);
		if (this.props.alive && !this.state.fullscreen || !this.props.alive && this.state.fullscreen) {
			maximize = React.createElement(
				'span',
				null,
				React.createElement(
					'a',
					{ title: 'fullscreen', href: '#', onClick: this.screen, className: 'btn btn-sm btn-default pull-right' },
					React.createElement('span', { className: 'glyphicon glyphicon-fullscreen' })
				)
			);
			if (!this.props.fullscreen && this.props.alive) move = React.createElement(
				'div',
				{ title: 'move console', className: 'btn btn-sm btn-warning pull-right handle' },
				React.createElement('span', { className: 'handle glyphicon glyphicon-move' })
			);
		} else if (this.props.alive) {
			maximize = React.createElement(
				'a',
				{ title: 'small window', href: '#', onClick: this.screen, className: 'btn btn-sm btn-default pull-right' },
				React.createElement('span', { className: 'glyphicon glyphicon-modal-window' })
			);
		} else {
			maximize = React.createElement(
				'a',
				{ title: 'View Console', href: '#', onClick: this.screen, className: 'btn btn-sm btn-default pull-right' },
				React.createElement('span', { className: 'glyphicon glyphicon-modal-window' })
			);
		}

		return React.createElement(
			Draggable,
			_extends({
				handle: '.handle',
				zIndex: 1000,
				moveOnStartChange: true,
				onStop: this.handleStop
			}, add, {
				bounds: 'parent' }),
			React.createElement(
				'div',
				{ className: classy },
				cmd,
				React.createElement(
					'div',
					{ className: 'col-sm-4 no-padding' },
					' ',
					move,
					React.createElement(
						'span',
						{ className: 'pull-right' },
						'   '
					),
					' ',
					minimize,
					React.createElement(
						'span',
						{ className: 'pull-right' },
						'   '
					),
					maximize,
					React.createElement(
						'span',
						{ className: 'pull-right' },
						'   '
					),
					clear,
					' '
				),
				React.createElement(
					'div',
					{ className: 'clearfix msg no-padding' },
					map
				)
			)
		);
	},
	clear: function clear() {
		this._cache = false;
		this._repeat = 1;
		this._sync = 0;
		this.setState({ log: [] });
	},
	command: function command(e) {
		e.preventDefault();
		if (_.isFunction(this.props.command)) {
			this.props.command(this.refs.console.getDOMNode().value);
		}
	},
	toggle: function toggle(e) {
		e.preventDefault();
		if (_.isFunction(this.props.toggle)) {
			this.props.toggle(e);
		}
	},
	screen: function screen(e) {
		e.preventDefault();
		if (!this.state.alive) {
			this.toggle(e);
		} else {
			this.setState({ fullscreen: !this.state.fullscreen });
		}
	}

});

module.exports = Console;