/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var hooks = require('../../../../node_modules/abao/lib/hooks'),
	ObjectId,
	mongoose = require('mongoose'),
	PASSWORD = 'dumbpassword',
	EMAIL = 'lukasz@example.com',
	USERNAME = 'sielay';

hooks.before('POST /api/auth/signup -> 200', function (test, done) {
	test.request.headers.user_email = EMAIL;
	test.request.headers.user_username = USERNAME;
	test.request.headers.user_password = PASSWORD;
	test.request.headers.user_first_name = 'Lukasz';
	test.request.headers.user_last_name = 'Sielski';
	done();
});

hooks.before('POST /api/auth/signin -> 200', function (test, done) {
	test.request.headers.user_username = USERNAME;
	test.request.headers.user_password = PASSWORD;
	done();
});

hooks.before('GET /api/auth/{oauthProvider} -> 200', function (test, done) {
	test.request.params.oauthProvider = 'test';
	done();
});

hooks.before('GET /api/auth/{oauthProvider} -> 400', function (test, done) {
	test.request.params.oauthProvider = 'unknow';
	done();
});

hooks.before('GET /api/auth -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	done();
});

hooks.before('POST /api/auth/forgot -> 200', function (test, done) {
	test.request.headers.username = 'theted';
	done();
});

hooks.before('GET /api/auth/reset/{token} -> 200', function(test, done){
	test.request.params.token = 'abcdefghij';
	done();
});

hooks.before('POST /api/auth/reset/{token} -> 200', function(test, done){
	test.request.params.token = 'abcdefghij';
	test.request.headers.validrequest = 'true';
	done();
});

hooks.before('POST /api/auth/reset/{token} -> 400', function(test, done){
	test.request.params.token = 'abcdefghij';
	done();
});


