/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';
exports.name = 'entity';

exports.up = function (db) {
	console.log('Migration ' + exports.name);
	var klass;
	return db.class.create('Entity', 'V').then(function (myClass) {
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
			name: 'uri',
			type: 'String'
		});
	});

};

exports.down = function (db) {
	// @todo implementation
};

