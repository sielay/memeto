/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

exports.name = 'type';

exports.up = function (db) {
	console.log('Migration ' + exports.name);
	var klass;
	return db.class.create('Type', 'V').then(function (myClass) {
		klass = myClass;
		return myClass;
	}).then(function () {
		return klass.property.create({
			name: 'name',
			type: 'String'
		});
	}).then(function () {
		return klass.property.create({
			name: 'meta',
			type: 'String'
		});
	}).then(function () {
		return klass.property.create({
			name: 'icon',
			type: 'String'
		});
	});
};

exports.down = function (db) {
	// @todo implementation
};

