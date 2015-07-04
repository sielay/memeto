/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint expr: true*/
'use strict';

var should  = require('should'),
	oriento = require('../../../../config/lib/orient'),
	db      = oriento.db,
	orient  = require('../../server/models/orient.server.model');

describe('Orient Model Base', function () {

	it('Handle not found items ', function (next) {

		function MyModel() {
		}

		orient(MyModel, 'MyModel');

		db.class.create('MyModel', 'V')
			.then(function () {
				return MyModel.queryOne('SELECT * FROM MyModel');
			}, next)
			.then(function (instance) {
				should.not.exist(instance);
				next();
			}, next)
			.catch(next);
	});

	it('Handle no duck type', function (next) {

		function MyModel() {
			this.hasValues = function () {
				return true;
			};
			this.getValues = function () {
				return {
					name: 'name'
				};
			};
		}


		orient(MyModel, 'MyModel2');

		db.class.create('MyModel2', 'V')
			.then(function () {
				return (new MyModel()).save();
			}, next)
			.then(function () {
				return MyModel.queryOne('SELECT * FROM MyModel2');
			}, next)
			.then(function (instance) {
				should.exist(instance);
				next();
			}, next)
			.catch(next);
	});

	it('Handle wrong update', function (next) {

		function MyModel() {
		}

		orient(MyModel, 'MyModel3');

		(new MyModel()).update()
			.then(next, function () {
				next();
			}, next)
			.catch(next);
	});


});
