/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint expr: true*/

'use strict';

var socket = require('../socket.io'),
	should = require('should');

should.warn = false;

describe('Socket Middleware', function () {

	it('Handles on Connect', function () {
		var socketMockup = {};
		socket.onConnection(socketMockup);
	});

	it('Middlewre works', function (next) {
		var socketMockup = {
				request: {
					headers:       {
						cookie: 'monster'
					},
					signedCookies: {
						'connect.sid': 'defghij'
					}
				}
			},
			mongoStoreMockup = {
				get : function(sessionId, callback) {
					callback(null, {});
				}
			};
		socket.ioUse(mongoStoreMockup)(socketMockup, function (err) {
			next();
		});
	});

});
