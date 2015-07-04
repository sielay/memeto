/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint latedef:false */

'use strict';

var q      = require('q'),
	orient = require('../../../../config/lib/orient'),
	db     = orient.db,
	chalk  = require('chalk'),
	async  = require('async');

module.exports = function (Model, className) {


	Model.buildQuery = function (options) {
		var query = 'SELECT * FROM ' + className,
			where = [];
		if (options) {
			if (options.filters) {
				Object.keys(options.filters).forEach(function(key){
					if(options.filters[key] === 'LIKE') {
						where.push(key + '.toLowerCase() LIKE :' + key);
					}
				});
			}
		}
		if(where.length > 0) {
			query += ' WHERE ' + where.join(' AND ');
		}
		if(options.limit) {
			query += ' LIMIT ' + options.limit;
		}
		return query;
	};

	/**
	 * Gets one Entity
	 * @param query
	 * @returns {Q.Promise}
	 */
	Model.getBy = function (query) {
		var deferred = q.defer();
		db.select()
			.from(className)
			.where(query)
			.one()
			.catch(deferred.reject)
			.then(function (instance) {
				if (!instance) return deferred.resolve(null);
				deferred.resolve(new Model(instance));
			}, deferred.reject);

		return deferred.promise;
	};

	/**
	 * Removes all vertices
	 * @returns {Q.Promise}
	 */
	Model.removeAll = function () {
		var deferred = q.defer();
		db.query('DELETE VERTEX ' + className + ' WHERE true')
			.catch(deferred.reject)
			.then(function (total) {
				deferred.resolve(total);
			}, deferred.reject);
		return deferred.promise;
	};

	/**
	 * TODO: hide
	 * Executre SELECT many query
	 * @param {String} query
	 * @param {Object} fields
	 * @returns {Q.Promise}
	 */
	Model.queryList = function (query, fields) {

		var deferred = q.defer();

		db.query(query, {
			params: fields || {}
		})
			.catch(deferred.reject)
			.all()
			.then(function (list) {
				var results = [];
				list.forEach(function (instance) {
					if (Model.ducktype) {
						return results.push(Model.ducktype(instance));
					}
					results.push(new Model(instance));

				});
				deferred.resolve(results);
			}, deferred.reject);


		return deferred.promise;
	};

	/**
	 *
	 * @param query
	 * @param fields
	 * @returns {Q.Promise}
	 */
	Model.queryOne = function (query, fields) {
		var deferred = q.defer();

		db.query(query, {
			params: fields || {},
			limit:  1
		})
			.catch(deferred.reject)
			.then(function (items) {
				if (!items || !items[0]) {
					return deferred.resolve(null);
				}
				if (Model.ducktype) {
					return deferred.resolve(Model.ducktype(items[0]));
				}
				deferred.resolve(new Model(items[0]));
			}, deferred.reject);


		return deferred.promise;
	};

	/**
	 * Saves current type
	 * @returns {Q.Promise}
	 */
	Model.prototype.save = function () {
		if (!this.id) return this.insert();
		return this.update();
	};

	/**
	 * Inserts element to database
	 * @returns {Q.Promise}
	 */
	Model.prototype.insert = function () {
		var deferred = q.defer(),
			self = this,
			command,
			values;

		if (this.hasValues()) {
			values = this.getValues();
		} else {
			values = {ts: new Date().getTime()};
		}

		function execute(className) {
			command = db.insert()
				.into(className)
				.set(values)
				.one()
				.catch(deferred.reject)
				.then(function (entity) {
					if(self.setValues) self.setValues(entity);
					deferred.resolve(self);
				}, deferred.reject);
		}

		if (Model.getClassName) {
			Model.getClassName(values).then(function (type) {
				execute(type);
			}, deferred.reject).catch(deferred.reject);
		} else {
			execute(className);
		}

		return deferred.promise;
	};

	/**
	 * Execute update
	 * @returns {Q.Promise}
	 */
	Model.prototype.update = function () {

		var deferred = q.defer(),
			self = this,
			command;

		if (!this.id) {
			deferred.reject(new Error('Element has to be saved before update'));
			return deferred.promise;
		}

		command = db.update(className);
		if (this.hasValues()) {
			command = command.set(this.getValues());
		}
		command.where({'@rid': this.id})
			.scalar()
			.catch(deferred.reject)
			.then(function () {
				deferred.resolve(self);
			}, deferred.reject);
		return deferred.promise;
	};

	/**
	 * Removes current Type
	 * @returns {Q.Promise}
	 */
	Model.prototype.delete = function () {
		return db.query('DELETE VERTEX ' + className + ' WHERE @rid = ' + this.id);
	};

	return Model;

};

/**
 * If you have time to read documentation, you can change it to nice query builder execution
 * @param {String} selectQuery
 * @param {Object} query
 * @returns {String}
 */
module.exports.tooLazyToUseQueryBuilderPropery = function (selectQuery, query, joiner) {
	var where = [],
		fields = Object.keys(query);
	joiner = joiner || ' = ';
	fields.forEach(function (key) {
		where.push(key + ' ' + joiner + ' :' + key);
	});

	if (where.length > 0) {
		selectQuery += ' WHERE ' + where.join(' AND ');
	}
	return selectQuery;
};

module.exports.LIKE = 'LIKE';
