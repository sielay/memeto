/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint expr: true*/

'use strict';

var api    = require('../api'),
	should = require('should');

should.warn = false;

describe('API Middleware', function () {

	var express = {
		res:   {
			_headers:  {},
			status:    function (status) {
				this._status = status;
				return this;
			},
			setHeader: function (name, value) {
				this._headers[name] = value;
				return this;
			}
		},
		req:   {
			query: {}
		},
		use:   function (middleware) {
			this._middleware = middleware;
		},
		check: function (callback) {
			this._middleware(this.req, this.res, callback);
		}
	};

	it('Inits', function (next) {
		api(express);
		express.check(next);
	});

	it('Formats errors', function (next) {
		express.res.send = function (content) {
			should(express.res._status).eql('500');
			should(content).be.String;
			var json = JSON.parse(content);
			should.exist(json.error);
			should.exist(json.stack);

			express.res.send = function (content) {
				should(express.res._status).eql('403');
				var json = JSON.parse(content);
				should.exist(json.error);
				should.exist(json.stack);
				next();
			};
			express.res.error(new Error('Aaaaa!'), 403);

		};
		express.res.error(new Error('Aaaaa!'));

	});

	it('Responds', function (next) {
		var MOCKUP = {
			elem: 1
		};
		express.res.send = function (content) {
			should(content).be.String;
			var json = JSON.parse(content);
			should(json).eql(MOCKUP);
			should(express.res._headers['Content-Type']).eql('application/json');
			next();
		};
		express.res.api(MOCKUP);
	});

	it('Clean response', function (next) {
		var MOCKUP = {
			elem: 1,
			sth:  {
				f: {
					r: 3,
					c: 4
				}
			},
			db:   [
				{
					a: 1
				},
				{
					b: 2
				}
			]


		};
		express.res.send = function (content) {
			should(content).be.String;
			var json = JSON.parse(content);
			should(json.elem).eql(1);
			should(json.sth.f.r).eql(3);
			should.not.exist(json.sth.f.c);
			should(json.db[0].a).eql(1);
			should.not.exist(json.db[1].b);
			should(express.res._headers['Content-Type']).eql('application/json');
			next();
		};
		express.res.api(MOCKUP, [
			'sth.f.c',
			'db.*.b'
		]);
	});

	it('Lists', function (next) {

		express.req.query.per_page = 3;
		express.req.query.page = 3;
		express.req.query.sort = 'a:1,b:-1';
		express.req.query.where = 'abc';

		var model = {
			count: function (query, callback) {
				should(query).be.Object;
				callback(null, 3);
			},
			find:  function (query) {
				var cursor = {
					_q:        query,
					_populate: [],
					sort:      function (sort) {
						this._sort = sort;
						return this;
					},
					skip:      function (skip) {
						this._skip = skip;
						return this;
					},
					limit:     function (limit) {
						this._limit = limit;
						return this;
					},
					populate:  function (populate) {
						this._populate.push(populate);
						return this;
					},
					exec:      function (callback) {

						should(this._sort).eql({
							a: 1,
							b: -1
						});
						should(this._limit).eql(3);
						should(this._skip).eql(6);
						should(this._populate).eql([
							'abc', 'def.ghi'
						]);
						should(this._q.where).eql(1);

						callback(null, [{id: 1}, {id: 2}, {id: 3}]);
					}
				};
				return cursor;
			}
		};

		express.res.send = function (content) {
			should(content).be.String;
			var json = JSON.parse(content);
			should(json).eql({
					'query':    {
						'where': 1
					},
					'items':    [
						{
							'id':     1,
							'eached': true
						},
						{
							'id':     2,
							'eached': true
						},
						{
							'id':     3,
							'eached': true
						}
					],
					'total':    3,
					'page':     3,
					'per_page': 3,
					'pages':    1
				}
			);

			express.res.send = function (content) {
				should(content).be.String;
				var json = JSON.parse(content);
				should(json).eql({
						'query':    {
							'where': 1
						},
						'items':    [
							{
								'id': 1
							},
							{
								'id': 2
							},
							{
								'id': 3
							}
						],
						'total':    3,
						'page':     3,
						'per_page': 3,
						'pages':    1
					}
				);
				next();
			};

			express.res.list(express.req, model, {
				where: 1
			}, ['abc', 'def.ghi']);
		};

		var i = 0;

		express.res.list(express.req, model, {
			where: 1
		}, ['abc', 'def.ghi'], function (item, next) {
			item.eached = true;
			if (i++ % 2 === 0) {
				next(null, item);
			} else {
				next();
			}

		});
	});

});
