/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

var hooks = require('../../../../node_modules/abao/lib/hooks'),
	ObjectId,
	mongoose = require('mongoose');

hooks.before('GET /api/integration -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	done();
});

hooks.before('POST /api/integration -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.query.name = 'Name';
	test.request.query.provider = 'github';
	test.request.query.clientID = 'github';
	test.request.query.clientSecret = 'github';
	done();
});

hooks.after('POST /api/integration -> 200', function (test, done) {
	ObjectId = test.response.body._id.toString();
	done();
});

hooks.before('POST /api/integration -> 400', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	done();
});

hooks.before('GET /api/integration/{integrationId} -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.integrationId = ObjectId;
	done();
});

hooks.before('GET /api/integration/{integrationId} -> 404', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.integrationId = mongoose.Types.ObjectId().toString();
	done();
});

hooks.before('PUT /api/integration/{integrationId} -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.integrationId = ObjectId;
	done();
});

hooks.before('PUT /api/integration/{integrationId} -> 404', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.integrationId = mongoose.Types.ObjectId().toString();
	done();
});

hooks.before('DELETE /api/integration/{integrationId} -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.integrationId = ObjectId;
	done();
});

hooks.before('GET /api/integration/providers -> 200', function(test, done) {
	test.request.headers.loggedIn = 'YeS!';
	done();
});
