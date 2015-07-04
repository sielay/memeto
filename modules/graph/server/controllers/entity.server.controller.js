/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var Entity = require('../models/entity.server.model'),
	model  = require('../models/orient.server.model'),
	_      = require('lodash');

/**
 *
 * @param req
 * @param res
 * POST /api/graph/entity
 */
module.exports.create = function (req, res) {
	var body = _.merge(_.merge({}, req.body), req.query); // ABAO is stupid
	(new Entity(body)).save().then(function (entity) {
		entity.populate().then(function (entity) {
			req.entity = entity;
			module.exports.read(req, res);
		}, res.error).catch(res.error);
	}, res.error).catch(res.error);
};

/**
 *
 * @param req
 * @param res
 * GET /api/graph/entity/:rid
 */
module.exports.read = function (req, res) {
	req.entity.json({
		depth: req.query.depth || 1
	}).then(function (json) {
		res.api(json);
	}, res.error).catch(res.error);
};

/**
 *
 * @param req
 * @param res
 * PUT /api/graph/entity/:rid
 */
module.exports.update = function (req, res) {
	var body = _.merge(_.merge({}, req.body), req.query); // ABAO is stupid
	if (Object.keys(body).length === 0) return res.error(new Error('Nothing to change'), 400);
	req.entity.setValues(body || {});
	req.entity.save().then(function (entity) {
		entity.populate().then(function (entity) {
			req.entity = entity;
			module.exports.read(req, res);
		}, res.error);
	}, res.error).catch(res.error);
};

/**
 *
 * @param req
 * @param res
 * DELETE /api/graph/entity/:rid
 */
module.exports.delete = function (req, res) {
	req.entity.delete().then(function () {
		res.api({status: true});
	}, res.error).catch(res.error);
};

module.exports.query = function (req, res) {

	var nameFilter = req.query.name || null,
		params = {};

	if (nameFilter) {
		params.name = nameFilter.toLowerCase() + '%';
	}


	Entity.queryList(Entity.buildQuery({
		filters: {
			name: model.LIKE
		},
		limit:   15
	}), params).then(function (list) {
		res.api(list);
	}, res.error).catch(res.error);
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @param id
 */
module.exports.byRID = function (req, res, next, id) {

	var promise;
	if (id === 'world') {
		promise = Entity.getByURI('mmt://world', true);
	} else {
		promise = Entity.getByRID(id, true);
	}
	promise.then(function (entity) {
		if (!entity)  return res.error(new Error('Not found'), 404);
		req.entity = entity;
		next();
	}, res.error).catch(res.error);
};

/**
 * 
 * @param req
 * @param res
 * @returns {void}
 */
module.exports.link = function (req, res) {

	var target = req.query.target || req.body.target || null;

	if (target === 'world') {
		return Entity.getByURI('mmt://world', true).then(function (world) {
			if (!world) return res.error('No world', 500);
			req.query.target = world.id;
			module.exports.link(req, res);
		}, function () {
			/* istanbul ignore next */
			res.error('No world', 500);
		}).catch(function () {
			/* istanbul ignore next */
			res.error('No world', 500);
		});
	}

	if (!target) return res.error('You must define target', 400);

	Entity.link({
		from: req.entity.id,
		to:   target
	}).then(function () {
		res.api(true);
	}, function (err) {
		/* istanbul ignore next */
		res.api(false);
	});

};
