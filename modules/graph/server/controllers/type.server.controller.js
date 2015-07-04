/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var Type  = require('../models/type.server.model'),
	model = require('../models/orient.server.model'),
	_     = require('lodash');

/**
 *
 * @param req
 * @param res
 * POST /api/graph/type
 */
module.exports.create = function (req, res) {

	try {
		var body = _.merge(_.merge({}, req.body), req.query); // ABAO is stupid
		(new Type(body)).save().then(function (entity) {
			req.type = entity;
			module.exports.read(req, res);
		}, function (err) {
			res.error(err, 400);
		}).catch(function (err) {
			// edge case
			/* istanbul ignore next */
			res.error(err, 400);
		});
	} catch (ex) {
		// edge case
		/* istanbul ignore next */
		console.log(ex);
	}
};

/**
 *
 * @param req
 * @param res
 * GET /api/graph/type/:rid
 */
module.exports.read = function (req, res) {
	return res.api(req.type);
};

/**
 *
 * @param req
 * @param res
 * PUT /api/graph/type/:rid
 */
module.exports.update = function (req, res) {
	var body = _.merge(_.merge({}, req.body), req.query); // ABAO is stupid
	if (Object.keys(body).length === 0) return res.error(new Error('Nothing to change'), 400);
	req.type.setValues(body || {});
	req.type.save().then(function (entity) {
		req.typ = entity;
		module.exports.read(req, res);
	}, res.error).catch(res.error);
};

/**
 *
 * @param req
 * @param res
 * DELETE /api/graph/type/:rid
 */
module.exports.delete = function (req, res) {
	req.type.delete().then(function () {
		res.api({status: true});
	}, res.error).catch(res.error);
};

/**
 *
 * @param req
 * @param res
 */
module.exports.query = function (req, res) {
	var nameFilter = req.query.name || '',
		query = 'SELECT * FROM Type WHERE name.toLowerCase() LIKE :name';

	nameFilter = nameFilter.toLowerCase() + '%';

	Type.queryList(query, {
		name: nameFilter
	}).then(function (list) {
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
	Type.getByRID(id).then(function (type) {
		if (!type)  return res.error(new Error('Not found'), 404);
		req.type = type;
		next();
	}, res.error).catch(res.error);
};
