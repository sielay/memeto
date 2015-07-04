/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint latedef:false */

'use strict';

var q      = require('q'),
	orient = require('../../../../config/lib/orient'),
	model  = require('./orient.server.model'),
	db     = orient.db,
	CLASS  = 'Type';

/**
 *
 * @param data
 * @param {RID|String} data.@rid
 * @param {String} data.name
 * @param {String} data.meta
 * @param {String} data.icon
 * @param {String} superType
 * @constructor
 */
function Type(data, superType) {
	this.superType = superType || 'Entity';
	this.setValues(data);
}

model(Type, CLASS);

/**
 * Gets one Type
 * @param rid
 * @returns {Q.Promise}
 */
Type.getByRID = function (rid) {
	return Type.getBy({
		'@rid': rid
	});
};

/**
 * Gets one Type
 * @param {String} meta
 * @returns {Q.Promise}
 */
Type.getByMeta = function (meta) {
	return Type.getBy({
		meta: meta
	});
};

/**
 * Get on by Safe Name
 * @param safeName
 * @returns {Q.Promise}
 */
Type.getBySafeName = function (safeName) {
	return Type.getBy({
		safeName: safeName
	});
};

/**
 * Gets list of Types by metas
 * @param {Array} metaList
 * @returns {Q.Promise}
 */
Type.getManyByMeta = function (metaList) {
	return this.queryList('SELECT * FROM ' + CLASS + ' WHERE meta IN [' + metaList.map(function (meta) {
		return '\'' + meta.replace(/'/g, '\'') + '\'';
	}).join(', ') + ']');
};

/**
 * Reads defined values
 * @returns {Object}
 */
Type.prototype.getValues = function () {
	var values = {};
	if (this.name) {
		values.name = this.name;
		values.safeName = this.safeName();
	}
	if (this.meta) values.meta = this.meta;
	if (this.icon) values.icon = this.icon;
	return values;
};

/**
 * Sets fields
 * @param values
 */
Type.prototype.setValues = function (values) {

	/* istanbul ignore next */
	if (!values) return;
	if (values['@rid']) this.id = values['@rid'].toString();
	if (values.name) this.name = values.name;
	if (values.meta) this.meta = values.meta;
	if (values.icon) this.icon = values.icon;
};

var inheritedInsert = Type.prototype.insert;

/**
 * Transforms meta to safe class name
 * @returns {string}
 */
Type.safeName = function (meta) {
	if(meta === 'Entity') return meta;
	return 'Entity_' + meta.replace(/:/g, '_').replace(/[^a-zA-Z0-9_]/g, '').replace(/_+/g, '_');
};

/**
 * Transforms meta to safe class name
 * @returns {string}
 */
Type.prototype.safeName = function () {
	return Type.safeName(this.meta);
};


/**
 *
 * @param {Type} instance
 * @returns {Q.Promise}
 */
function linkToSuperType(instance, superType) {
	var deferred = q.defer();
	Type.getBySafeName(Type.safeName(superType)).then(function (superType) {
		if (superType) {
			return db.create('EDGE', 'E')
				.from(instance.id)
				.to(superType.id)
				.one()
				.catch(deferred.reject)
				.then(deferred.resolve, deferred.reject).catch(deferred.reject);
		}
		deferred.resolve(instance);
	}, deferred.reject).catch(deferred.reject);
	return deferred.promise;
}

/**
 * Registers Entity class in OrientDB
 * @param {Tyoe} that
 * @returns {Q.Promise}
 */
function registerClass(that) {
	var safeName = that.safeName(), deferred = q.defer();
	db.class.create(safeName, Type.safeName(that.superType)).then(function () {
		deferred.resolve();
	}, function (err) {
		if (err.message.toString().match(/^Class (.+) already exists in current database$/)) return deferred.resolve();
		/* istanbul ignore next */
		deferred.reject(err);
	}).catch(deferred.reject);
	return deferred.promise;
}

/**
 * Overrides insert
 * @returns {Q.Promise}
 */
Type.prototype.insert = function () {
	var that = this, deferred = q.defer(), type = null, superType = this.superType;
	inheritedInsert.apply(this)
		.then(function (instance) {
			type = instance;
			return registerClass(that, deferred);
		}, deferred.reject)
		.then(function () {
			return linkToSuperType(type, superType);
		}, deferred.reject)
		.then(function () {
			deferred.resolve(type);
		}, deferred.reject)
		.catch(deferred.reject);
	return deferred.promise;
};


/**
 * Checks if has values, except RID
 * @returns {values.name|*}
 */
Type.prototype.hasValues = function () {
	return (this.name || this.meta || this.meta);
};


module.exports = Type;
