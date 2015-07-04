/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var Type = require('../type.server.model');

exports.name = 'basetypes';

exports.up = function (db) {
	console.log('Migration ' + exports.name);

	var handleError = function (err) {
			/* istanbul ignore next */
			console.log(err);
			/* istanbul ignore next */
			throw err;
		},
		group = null,
		instance = null,
		identity = null;

	return (new Type({
		name:       'Group',
		icon:       'fa-group',
		meta:       'generic:group',
		superClass: 'Entity'
	})).save()
		.then(function (type) {
			group = type;
			return (new Type({
				name:       'Instance',
				icon:       'fa-cube',
				meta:       'generic:instance',
				superClass: 'Entity'
			})).save();
		}, handleError)
		.then(function (type) {
			instance = type;
			return (new Type({
				name:       'Identity',
				icon:       'fa-key',
				meta:       'generic:identity',
				superClass: 'Entity'
			})).save();
		}, handleError)
		.then(function (type) {
			identity = type;
			return (new Type({
				name:       'Organisation',
				icon:       'fa-institution',
				meta:       'generic:organisation',
				superClass: group.safeName()
			})).save();
		}, handleError)
		.then(function (type) {
			identity = type;
			return (new Type({
				name:       'Team',
				icon:       'fa-group',
				meta:       'generic:team',
				superClass: group.safeName()
			})).save();
		}, handleError)
		.catch(handleError);

};

exports.down = function (db) {
	// @todo implementation
};

