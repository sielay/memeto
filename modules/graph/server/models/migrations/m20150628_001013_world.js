/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var Type   = require('../type.server.model'),
	Entity = require('../entity.server.model');

exports.name = 'world';

exports.up = function (db) {
	console.log('Migration ' + exports.name);

	var handleError = function (err) {
		/* istanbul ignore next */
		console.log(err);
		/* istanbul ignore next */
		throw err;
	};

	return (new Type({
		name:       'World',
		icon:       'fa-globe',
		meta:       'generic:world',
		superClass: 'Entity'
	})).save().then(function () {

			return (new Entity({
				name: 'World',
				uri:  'mmt://world',
				meta: 'generic:world'
			})).save();

		}, handleError).catch(handleError);
};

exports.down = function (db) {
	// @todo implementation
};

