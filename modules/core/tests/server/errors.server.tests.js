/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var errors = require('../../server/controllers/errors.server.controller');

describe('Error controller', function () {

	it('Simple error', function () {
		errors.getErrorMessage(new Error('Random Error'));
	});

	it('Error with code', function () {
		var err = new Error('Random Error');
		err.code = 404;
		errors.getErrorMessage(err);
	});

	it('Error with sub errors', function () {
		var err = new Error('Random Error');
		err.errors = [
			new Error('Another Error'),
			new Error('More Errors'),
			new Error('Still an Error')
		];
		errors.getErrorMessage(err);
	});

	it('Error with unique error message', function(){
		var err = new Error('Special Error');
		err.code = 11001;
		errors.getErrorMessage(err);

		err = new Error('Special Error');
		err.code = 11000;
		err.err = 'hakuna.$.sdfadsf.dsafsaf.s_1.sdafasdf';
		errors.getErrorMessage(err);
	});

});
