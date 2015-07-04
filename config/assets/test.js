/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

module.exports = {
	tests: {
		client: ['modules/*/tests/client/**/*.js'],
		server: ['modules/*/tests/server/**/*.js','config/lib/tests/*.js'],
		e2e: ['modules/*/tests/e2e/**/*.js']
	}
};
