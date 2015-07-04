/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint expr: true*/
/*jshint -W069 */

'use strict';

var crud   = require('../crud'),
	should = require('should');

should.warn = false;

describe('CRUD helper', function () {

	var app = {
			_routes: {},
			route:   function (path) {
				var _route = {
					_path:  path,
					get:    function (method) {
						this._get = method;
					},
					post:   function (method) {
						this._post = method;
					},
					put:    function (method) {
						this._put = method;
					},
					delete: function (method) {
						this._delete = method;
					}

				};
				this._routes[path] = _route;
				return _route;
			},
			param:   function (id, callback) {
				this._param = callback;
			}
		},
		modelMockup = function () {
			this.save = function(callback) {
				callback(null, this);
			};
		},
		populateMockup = ['cos.tam', 'cos.jeszcze'],
		VOID = function () {};

	modelMockup.findOne = function (query, callback) {
		should.exist(query._id);
		if (query._id === '0') {
			return callback(new Error('404'));
		}
		callback(null, {
			_id: query._id
		});
	};

	modelMockup.populate = function (a, b, callback) {
		a[b] = true;
		callback(null, a);
	};


	it('Setups', function (next) {
		try {
			crud(app);
			app.crud('mypath/:myitemId', modelMockup, [], {}, populateMockup);
		} catch (err) {
			return next(err);
		}
		next();
	});

	it('Param works - no param', function (next) {
		app._param({}, null, function (err) {
			should.exist(err);
			next();
		});
	});

	it('Param works - empty param', function (next) {
		app._param({}, {
			error: function (err, status) {
				should.exist(err);
				should(status).eql(400);
				next();
			}
		}, VOID, '0');
	});

	it('Param works - has param', function (next) {
		var req = {};
		app._param(req, null, function (err) {
			should.not.exist(err);
			should.exist(req.myitem);
			next();
		}, 'ABC');
	});

	it('Query works', function (next) {
		app._routes.mypath._get({}, {
			list: function (req, Model, query, populate) {
				should(Model).eql(modelMockup);
				should(populate).eql(populateMockup);
				next();
			}
		});
	});

	it('Get works', function (next) {
		app._routes['mypath/:myitemId']._get({
			myitem: {}
		}, {
			error: function (e) {
				throw e;
			},
			api:   function (c) {
				next();
			}
		});
	});

	it('Post works', function (next) {
		app._routes.mypath._post({
			body: {
				_id: {
					$id: 'ABC'
				}
			}
		}, {
			api: function (resp) {
				next();
			}
		});
	});

})
;
