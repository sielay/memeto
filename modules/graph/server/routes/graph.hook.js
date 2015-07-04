/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

var hooks = require('../../../../node_modules/abao/lib/hooks'),
	rid,
	sid = null;

// ENTITY

hooks.before('POST /api/graph/entity -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	done();
});

hooks.after('POST /api/graph/entity -> 200', function (test, done) {
	rid = test.response.body.id;
	done();
});

hooks.before('GET /api/graph/entity -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.query.name = 'instance';
	done();
});

hooks.before('GET /api/graph/entity/{rid} -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.rid = encodeURI(rid.replace('#', ''));
	done();
});

hooks.before('GET /api/graph/entity/{rid} -> 404', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.rid = 'unknown';
	done();
});

hooks.before('PUT /api/graph/entity/{rid} -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.query = {name: 'Hakuna Matata!'};
	test.request.params.rid = encodeURI(rid.replace('#', ''));
	done();
});

hooks.before('PUT /api/graph/entity/{rid} -> 404', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.rid = 'unknown';
	done();
});

hooks.before('PUT /api/graph/entity/{rid} -> 400', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.rid = encodeURI(rid.replace('#', ''));
	done();
});

hooks.before('POST /api/graph/entity/{rid} -> 403', function (test, done) {
	test.request.params.rid = encodeURI(rid.replace('#', ''));
	done();
});

hooks.before('POST /api/graph/entity/{rid} -> 404', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.rid = 'unknown';
	done();
});

hooks.before('POST /api/graph/entity/{rid} -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.query.target = rid;
	test.request.params.rid = encodeURI(rid.replace('#', ''));
	done();
});

hooks.before('POST /api/graph/entity/{rid} -> 500', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.query.target = 'world';
	test.request.params.rid = encodeURI(rid.replace('#', ''));
	done();
});


hooks.before('POST /api/graph/entity/{rid} -> 400', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.rid = encodeURI(rid.replace('#', ''));
	done();
});

hooks.before('DELETE /api/graph/entity/{rid} -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.rid = encodeURI(rid.replace('#', ''));
	done();
});

hooks.before('DELETE /api/graph/entity/{rid} -> 404', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.rid = 'unknown';
	done();
});

// TYPE

hooks.before('POST /api/graph/type -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.query.name = 'MyType';
	test.request.query.meta = 'my:type:meta';
	done();
});

hooks.before('POST /api/graph/type -> 400', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	done();
});

hooks.after('POST /api/graph/type -> 200', function (test, done) {
	try {
		rid = test.response.body.id;
		done();
	} catch (ex) {
		/* istanbul ignore next */
		done(ex);
	}
});

hooks.before('GET /api/graph/type -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	done();
});

hooks.before('GET /api/graph/type/{typeId} -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.typeId = encodeURI(rid.replace('#', ''));
	done();
});

hooks.before('GET /api/graph/type/{typeId} -> 404', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.typeId = 'unknown';
	done();
});

hooks.before('PUT /api/graph/type/{typeId} -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.query = {name: 'Hakuna Matata!'};
	test.request.params.typeId = encodeURI(rid.replace('#', ''));
	done();
});

hooks.before('PUT /api/graph/type/{typeId} -> 400', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.typeId = encodeURI(rid.replace('#', ''));
	done();
});

hooks.before('PUT /api/graph/type/{typeId} -> 404', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.typeId = 'unknown';
	done();
});

hooks.before('DELETE /api/graph/type/{typeId} -> 200', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.typeId = encodeURI(rid.replace('#', ''));
	done();
});

hooks.before('DELETE /api/graph/type/{typeId} -> 404', function (test, done) {
	test.request.headers.loggedIn = 'YeS!';
	test.request.params.typeId = 'unknown';
	done();
});
