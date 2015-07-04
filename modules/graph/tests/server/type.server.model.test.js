/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint expr: true*/
'use strict';

var should = require('should'),
	Type   = require('../../server/models/type.server.model');

describe('Entity Types', function () {

	before(function (done) {
		Type.removeAll().then(function () {
			done();
		}, function (err) {
			done(err);
		});
	});

	it('Creates Type', function (next) {

		var NAME = 'M Name',
			ICON = 'fa-group',
			META = 'etaMeta',
			instance1;

		(new Type({
			name: NAME,
			icon: ICON,
			meta: META
		})).save().then(function (instance) {

				should.exist(instance);
				should(/^\#\d+\:\d+$/.test(instance.id)).be.true;
				should(instance.icon).eql(ICON);
				should(instance.meta).eql(META);
				should(instance.name).eql(NAME);

				instance1 = instance;
				return Type.getByRID(instance.id);
			}, next)
			.then(function (instance) {
				should.exist(instance);
				should(instance.getValues()).eql(instance1.getValues());

				return Type.getByMeta(instance.meta);
			}, next)
			.then(function (instance) {
				should.exist(instance);
				should(instance.getValues()).eql(instance1.getValues());
				next();
			}, next).catch(next);
	});

	it('Lists types by meta', function (next) {
		Type.getManyByMeta([
			'etaMeta',
			'tamtaMeta'
		]).then(function (list) {
			should(list.length).eql(1);
			should(list[0].name).eql('M Name');
			next();
		}, next).catch(next);
	});

	it('Creates hierarchy', function (next) {
		(new Type({
			name: 'Child',
			icon: 'abudabi',
			meta: 'sdfsd'
		}, 'etaMeta')).save().then(function () {
				return (new Type({
					name: 'Grand Child',
					icon: 'abudabi',
					meta: 'sdfsd2'
				}, 'sdfsd')).save();
			}, next).then(function () {
				return (new Type({
					name: 'Grand Child',
					icon: 'abudabi',
					meta: 'sdfsd2'
				}, 'sdfsd')).save();
			}).then(function () {
				next();
			}, next).catch(next);
	});

});
