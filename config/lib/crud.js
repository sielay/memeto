/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var _       = require('lodash'),
	compare = require('mongoosecompare');

module.exports = function (app) {

	function isObject(a) {
		return (!!a) && (a.constructor === Object);
	}

	function flat(body) {
		var result = {};
		Object.keys(body).forEach(function (key) {
			if (isObject(body[key]) && body[key].$id) {
				result[key] = compare.str(body[key]);
			} else {
				result[key] = body[key];
			}
		});
		return result;
	}

	app.crud = function (path, Model, middleWare, overrides, populate) {

		overrides = overrides || {};

		var leftPath = path.replace(/\/:([a-zA-Z0-9-]+)$/, ''),
			param = path.replace(/^(.+):/, ''),
			field = param.replace(/Id$/, '');

		var route = this.route(leftPath),
			detailedRoute = this.route(path);

		if (middleWare && middleWare.length) {
			var nextMiddleWare = middleWare.shift();
			while (nextMiddleWare) {
				route.all(nextMiddleWare);
				detailedRoute.all(nextMiddleWare);
				nextMiddleWare = middleWare.shift();
			}
		}

		app.param(param, overrides.param || function (req, res, next, id) {
			if (!id || id === 'undefined') {
				return next(new Error('Id `' + param + '` is not defined'));
			}
			Model.findOne({
				_id: id
			}, function (err, item) {
				if (err) return res.error(err, 400);
				req[field] = item;
				next();
			});
		});

		route.get(overrides.list || function (req, res) {
			res.list(req, Model, {}, populate);
		});

		route.post(overrides.create || function (req, res) {

			var body = _.merge(_.merge({}, req.body), req.query);
			var model = new Model(flat(body));
			model.save(function (err) {
				if (err) return res.error(err, 400);
				res.api(model);
			});
		});

		detailedRoute.get(overrides.read || function (req, res) {
			if (!req[field]) {
				return res.error('Not found', 404);
			}
			if (populate && populate.length > 0) {
				var _populate = [].concat(populate);
				var object = req[field];
				var iterate = function () {
					var current = _populate.shift();
					if (!current) {
						return res.api(object);
					}
					Model.populate(object, current, function (err, obj) {
						// it's mongoose matter
						/* istanbul ignore next */
						if (err) return res.error(err, 400);
						object = obj;
						iterate();
					});
				};
				return iterate();
			}
			res.api(req[field]);
		});

		detailedRoute.put(overrides.update || function (req, res) {
			if (!req[field]) {
				return res.error('Not found', 404);
			}
			var body = _.merge(_.merge({}, req.body), req.query);
			_.extend(req[field], flat(body)).save(function (err, item) {
				// it's mongoose matter
				/* istanbul ignore next */
				if (err) return res.error(err, 400);
				res.api(item);
			});
		});

		detailedRoute.delete(overrides.delete || function (req, res) {
			// it's mongoose matter
			/* istanbul ignore next */
			if (!req[field]) {
				return res.error('Not found', 404);
			}
			Model.remove({
				_id: req[field]._id
			}, function (err) {
				// it's mongoose matter
				/* istanbul ignore next */
				if (err) return res.error(err);
				res.api(true);
			});
		});
	};
};
