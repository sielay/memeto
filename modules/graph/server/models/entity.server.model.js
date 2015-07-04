/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint latedef:false */

'use strict';

var q      = require('q'),
	orient = require('../../../../config/lib/orient'),
	Type   = require('./type.server.model'),
	model  = require('./orient.server.model'),
	async  = require('async'),
	db     = orient.db,
	CLASS  = 'Entity';

/**
 * See /docs/GRAPH.md
 */


/**
 *
 * @param initialData
 * @constructor
 */
function Entity(initialData) {
	this.setValues(initialData);
}

/**
 * Gets class name for given data. That allows to create subclasses in OrientDB
 * @param data
 * @returns {Q.Promise}
 */
Entity.getClassName = function (data) {
	var deferred = q.defer();
	if (data.meta) {
		Type.getByMeta(data.meta).then(function (type) {
			if (type) {
				return deferred.resolve(type.safeName());
			}
			deferred.resolve(CLASS);
		}, deferred.reject).catch(deferred.reject);
	} else {
		deferred.resolve(CLASS);
	}
	return deferred.promise;
};

model(Entity, CLASS);

function populate(entity) {
	if (!entity) return null;
	return entity.populate();
}

/**
 * Gets one Entity
 * @param rid
 * @returns {Q.Promise}
 */
Entity.getByRID = function (rid, populateChildren) {
	return this.getBy({
		'@rid': rid
	}, populateChildren).then(populate);
};

/**
 * Gets one Entity
 * @param rid
 * @returns {Q.Promise}
 */
Entity.getByURI = function (uri, populateChildren) {
	return this.getBy({
		'uri': uri
	}, populateChildren).then(populate);
};

Entity.prototype.populate = function () {
	var deferred = q.defer(), that = this;
	Type.getByMeta(this.meta).then(function (type) {
		that.type = type;
		deferred.resolve(that);
	}, deferred.reject).catch(deferred.reject);
	return deferred.promise;
};

/**
 * Links two Entities
 * @param options
 * @param options.from
 * @param options.to
 * @param options.name
 * @param options.type
 * @returns {Q.Promise}
 */
Entity.link = function (options) {
	var deferred = q.defer();

	if (!options) deferred.reject(new Error('Empty options'));
	else if (!options.from) deferred.reject(new Error('From is not set'));
	else if (!options.to) deferred.reject(new Error('To is not set'));

	if (deferred.promise.isRejected()) {
		return deferred.promise;
	}

	var values = {}, from = options.from, to = options.to;

	if (from instanceof Entity) {
		from = from.id.toString();
	}

	if (to instanceof Entity) {
		to = to.id.toString();
	}

	if (options.role) values.role = options.role;

	var command = db.create('Edge', options.type)
		.from(from)
		.to(to);

	if (values.role) {
		command = command.set(values);
	}
	command
		.one()
		.catch(deferred.reject)
		.then(function (edge) {
			deferred.resolve(edge);
		}, deferred.reject);

	return deferred.promise;
};

/**
 * Gets incoming links for Entity
 * @param to
 * @param {String|Array} classes
 * @returns {Q.Promise}
 */
Entity.in = function (to, classes) {

	var query = 'SELECT EXPAND(IN(';
	if (classes) {
		if (Array.isArray(classes)) {
			query += '\'' + classes.join('\',\'') + '\'';
		} else {
			query += '\'' + classes + '\'';
		}
	}
	query += ')) FROM ' + CLASS + ' WHERE @rid = ' + to;
	return Entity.queryList(query);
};

/**
 * Get outgoing links for Entity
 * @param from
 * @param {String|Array} classes
 * @returns {Q.Promise}
 */
Entity.out = function (from, classes) {

	var query = 'SELECT EXPAND(OUT(';
	if (classes) {
		if (Array.isArray(classes)) {
			query += '\'' + classes.join('\',\'') + '\'';
		} else {
			query += '\'' + classes + '\'';
		}
	}
	query += ')) FROM ' + CLASS + ' WHERE @rid = ' + from;
	return Entity.queryList(query);
};

/**
 *
 * @param instance
 * @returns {Object|Relation|Entity}
 */
Entity.ducktype = function (instance) {

	if (!instance) return instance;
	if (instance.role) return new Relation(instance);
	if (instance['@class']) return new Entity(instance);
	return instance;
};

/**
 * Checks if has values, except RID
 * @returns {values.name|*}
 */
Entity.prototype.hasValues = function () {
	return (this.name || this.meta || this.uri);
};

/**
 * Reads defined values
 * @returns {Object}
 */
Entity.prototype.getValues = function () {
	var values = {};
	if (this.name) values.name = this.name;
	if (this.meta) values.meta = this.meta;
	if (this.uri) values.uri = this.uri;
	return values;
};

/**
 * Sets fields
 * @param values
 */
Entity.prototype.setValues = function (values) {

	if (!values) return;
	if (values['@rid']) this.id = values['@rid'].toString();
	if (values.name) this.name = values.name;
	if (values.meta) this.meta = values.meta;
	if (values.uri) this.uri = values.uri;
};

/**
 * @see Entity.in
 * @param classes
 * @returns {Q.Promise}
 */
Entity.prototype.in = function (classes) {
	return Entity.in(this.id, classes);
};

/**
 * @see Entity.out
 * @param classes
 * @returns {Q.Promise}
 */
Entity.prototype.out = function (classes) {
	return Entity.out(this.id, classes);
};

/**
 * See Entity.link
 * @param {Entity|String|RID} entityOrRID
 * @param {String} type - edge class
 * @param {String} role - role
 * @returns {Q.Promise}
 */
Entity.prototype.linkTo = function (entityOrRID, type, role) {
	return Entity.link({from: this, to: entityOrRID, type: type, role: role});
};

/**
 * Analyse result and ensure you will get vertexes, even if traversing returned edges
 * @param {Array} results
 * @param {Q.Deferred} deferred
 */
function iterateOnVertexesAndEdges(results, id, deferred) {
	var filtered = [];

	// DRY to the limit
	function pushAndIt(element) {
		filtered.push(element);
		it();
	}

	function it() {

		var current = results.shift();
		if (!current) {
			deferred.resolve(filtered);
		}
		if (current instanceof Entity) return pushAndIt(current);

		current.findHook(id).then(function (hook) {
			pushAndIt(hook);
		}, deferred.reject);
	}

	it();
}

/**
 * Digs related elements matching query
 * @param {Object} query
 * @returns {Q.Promsie}
 */
Entity.prototype.dig = function (query) {

	var deferred = q.defer(),
		sql = 'SELECT FROM (TRAVERSE * FROM ' + this.id + ' STRATEGY BREADTH_FIRST)',
		self = this;

	Entity.queryList(model.tooLazyToUseQueryBuilderPropery(sql, query), query).then(function (results) {
		iterateOnVertexesAndEdges(results, self.id, deferred);
	}, deferred.reject).catch(deferred.reject);

	return deferred.promise;

};

Entity.prototype.json = function (options, depth) {
	var deferred = q.defer(),
		that = this;
	depth = depth || 0;
	options.depth = options.depth || 1;

	var data = {
		id:   this.id,
		name: this.name,
		meta: this.meta,
		type: {
			name: this.type ? this.type.name : null,
			icon: this.type ? this.type.icon : null
		}
	};

	if (options.depth <= depth) {
		deferred.resolve(data);
		return deferred.promise;
	}

	function getLinked(direction, collection) {
		var innerDeferred = q.defer();
		that[direction]().then(function (list) {
			data[collection] = [];
			async.eachSeries(list, function (current, next) {
				current.json(options, depth + 1).then(function (node) {
					data[collection].push(node);
					next();
				}, innerDeferred.reject);
			}, function () {
				innerDeferred.resolve();
			}).catch(innerDeferred.reject);

		}, innerDeferred.reject);
		return innerDeferred.promise;
	}

	getLinked('in', 'nodes')
		.then(function () {
			return getLinked('out', 'parents');
		}).then(function () {
			deferred.resolve(data);
		});

	return deferred.promise;

};

/**
 * Wrapper around edge
 * @param data
 * @param {Object|String|RID} data.@rid
 * @param {String} data.role
 * @param {Object|String|RID} data.in
 * @param {Object|String|RID} data.out
 * @constructor
 */
function Relation(data) {
	this.id = data['@rid'].toString();
	this.role = data.role;
	this.in = data.in;
	this.out = data.out;
}

/**
 * Gets in vertex for edge
 * @returns {Q.Promise}
 */
Relation.prototype.getIn = function () {
	return Entity.getByRID(this.in.toString());
};

/**
 * Gets out vertex for edge
 * @returns {Q.Promise}
 */
Relation.prototype.getOut = function () {
	return Entity.getByRID(this.out.toString());
};

/**
 * Finds next step on traverse path between vertex and edge. If you were digging for
 * element that has role = ABC to vertex A, you will get edge between last element of the path
 * and element you look for. To get that element you have to understand path you traversed and
 * return following element. It's clearly workaround. But can be improved later
 * @param {String} rid
 * @returns {Q.Promise}
 */
Relation.prototype.findHook = function (rid) {

	var deferred = q.defer(),
		self = this,
		query = 'SELECT $path FROM (TRAVERSE * FROM ' + this.id + ' ) WHERE @rid = ' + rid;

	Entity.queryOne(query).then(function (result) {
		var direction = result.$path.match(/^\(\#\d+:\d+\)\.([a-z]+)/)[1];
		self[direction === 'in' ? 'getOut' : 'getIn']().then(deferred.resolve, deferred.reject);
	}, deferred.reject);

	return deferred.promise;
};

Entity.Relation = Relation;
module.exports = Entity;
