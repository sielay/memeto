/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint expr: true*/

'use strict';

var should           = require('should'),
	strategy         = require('../../../server/config/strategies/local'),
	USERNAME_UNKNOWN = 'USERNAME_UNKNOWN',
	USERNAME         = 'USERNAME',
	USERNAME_ERR     = 'USERNAME_ERR',
	WRONG_PASSWORD   = 'WRONG_PASSWORD',
	PASSWORD         = 'PASSWORD',
	UserMockup       = {
		USERNAME:       'username',
		EMAIL:          'email',
		findByProvider: function (providers, id, callback) {
			try {
				should(providers).eql([UserMockup.USERNAME, UserMockup.EMAIL]);
				if (id === USERNAME_UNKNOWN) return callback();
				if (id === USERNAME_ERR) return callback(new Error('err'));
				callback(null, {
					authenticate: function (password) {
						return password === PASSWORD;
					}
				});
			} catch (ex) {
				return callback(ex);
			}
		}
	};

describe('Local passport strategy', function () {

	it('Handle unknown user', function (next) {

		strategy.handler(UserMockup)(USERNAME_UNKNOWN, WRONG_PASSWORD, function (err, user, msg) {
			should.not.exist(err);
			should(user).be.False;
			should.exist(msg.message);
			next();
		});

	});

	it('Handle wrong password', function (next) {

		strategy.handler(UserMockup)(USERNAME, WRONG_PASSWORD, function (err, user, msg) {
			try {
				should.not.exist(err);
				should(user).be.False;
				should.exist(msg.message);
				next();
			} catch (er) {
				next(er);
			}
		});

	});

	it('Handle valid user', function (next) {

		strategy.handler(UserMockup)(USERNAME, PASSWORD, function (err, user) {
			try {
				should.not.exist(err);
				should(user).be.Object;
				next();
			} catch (er) {
				next(er);
			}
		});

	});

	it('Handle error', function (next) {

		strategy.handler(UserMockup)(USERNAME_ERR, PASSWORD, function (err) {
			try {
				should.exist(err);
				next();
			} catch (er) {
				next(er);
			}

		});

	});

});
