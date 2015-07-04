/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';
exports.name = 'typeparent';

exports.up = function (db) {
	console.log('Migration ' + exports.name);
	return db.class.get('Type').then(function (myClass) {
		return myClass.property.create({
			name: 'safeName',
			type: 'String'
		});
	});
};

exports.down = function (db) {
	// @todo implementation
};

