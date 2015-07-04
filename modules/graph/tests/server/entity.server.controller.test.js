/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint expr: true*/
'use strict';

var should = require('should'),
	entity = require('../../server/controllers/entity.server.controller');

describe('Entity Controller', function () {

	it('Query World', function (next) {
		var req = {};
		entity.byRID(req, {
			error: function (err) {
				next(err);
			}
		}, function () {
			should.exist(req.entity);
			next();
		}, 'world');
	});

	/**
	 * Abao doesn't support multiple variants
	 */
	it('Links to the world', function (next) {
		var req = {
				query:  {
					target: 'world'
				},
				entity: {
					id: '#1:1'
				}
			},
			res = {
				api:   function () {
					next();
				},
				error: next
			};
		entity.link(req, res);

	});

});
