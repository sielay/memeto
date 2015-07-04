/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

exports.name = 'basetypes';

exports.up = function (db) {
	console.log('Migration ' + exports.name);
	db.class.create('Group', 'Entity').then(function () {
		return db.class.create('Instance', 'Entity');
	}).then(function () {
		return db.class.create('Identity', 'Entity');
	}).then(function () {
		return db.class.create('Organisation', 'Group');
	}).then(function () {
		return db.class.create('Team', 'Group');
	});
};

exports.down = function (db) {
	// @todo implementation
};

