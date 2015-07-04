/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var hooks    = require('../../../../node_modules/abao/lib/hooks'),
	mongoose = require('mongoose');

hooks.before('DELETE /api/users/accounts -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.query.provider = 'any';
	test.request.query.id = 'anyId';
	done();
});

hooks.before('DELETE /api/users/accounts -> 400', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	done();
});

hooks.before('GET /api/users/{userId} -> 400', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.userId = 'invalid';
	done();
});

hooks.before('GET /api/users/{userId} -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.userId = mongoose.Types.ObjectId().toString();
	done();
});

hooks.before('GET /api/users/{userId} -> 403', function (test, done) {
	test.request.params.userId = mongoose.Types.ObjectId().toString();
	done();
});

hooks.before('GET /api/users -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	done();
});

hooks.before('GET /api/users/me -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	done();
});

hooks.before('POST /api/users/password -> 400', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	done();
});

hooks.before('POST /api/users/password -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.query.currentPassword = 'abc';
	test.request.query.newPassword = 'abc1';
	test.request.query.verifyPassword = 'abc1';
	done();
});

