/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';
exports.name = 'relation';

exports.up = function (db) {
	console.log('Migration ' + exports.name);
	var klass;
	return db.class.create('Relation', 'E').then(function (myClass) {
		klass = myClass;
		return myClass;
	}).then(function () {
		return klass.property.create({
			name: 'role',
			type: 'String'
		});
	});

};

exports.down = function (db) {
	// @todo implementation
};

