/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint expr: true*/
'use strict';

var should  = require('should'),
	Manager = require('../../server/managers/meta.server.manager');

function Type() {

}

describe('Meta Manager', function () {

	it('Constructs', function (next) {
		var errCount = 0,
			manager;

		try {
			manager = new Manager();
		} catch (err) {
			errCount++;
		}

		try {
			manager = new Manager({});
		} catch (err) {
			errCount++;
		}

		try {
			manager = new Manager({
				Type: Type
			});
		} catch (err) {
			errCount++;
		}

		should(errCount).eql(2);
		should.exist(manager);
		next();
	});

	it('Registers data', function () {
		var manager = new Manager({
			Type: Type
		});

		manager.registerMeta('my:meta');
		try {
			manager.registerMeta('my:meta');
		} catch (e) {
		}
		should(manager.getRegisteredMetas()).eql([
			'my:meta'
		]);
	});
});
