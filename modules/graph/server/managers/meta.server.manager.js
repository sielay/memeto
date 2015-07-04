/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 *
 * Role of that manager is to manage registered extensions metas to types
 */

'use strict';

var q = require('q');

/**
 * registerMeta method factory
 * @param vault
 * @returns {Function}
 */
function registerMeta(vault) {
	/**
	 * @param meta
	 */
	return function (meta) {
		if (vault.repository[meta]) {
			throw new Error('Meta `' + meta + '` is already registed');
		}
		vault.repository[meta] = true;
	};
}

/**
 * Gets list of registed metas
 * @param vault
 * @returns {Function}
 */
function getRegisteredMetas(vault) {
	return function () {
		return Object.keys(vault.repository);
	};
}

/**
 *
 * @param injecitons
 * @param injections.Type
 * @constructor
 */
function MetaManager(injections) {
	if (!injections) throw new Error('MetaManager require injections');
	if (!injections.Type) throw new Error('MetaManager require Type model injection');

	var vault = {
		repository: {}
	};

	this.registerMeta = registerMeta(vault);
	this.getRegisteredMetas = getRegisteredMetas(vault);

}

module.exports = MetaManager;
