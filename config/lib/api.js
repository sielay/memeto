/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

/**
 * Formats error resonse
 * @param {Error|String|Mixed} error
 * @param {Number} status
 */
function errorHandler(error, status) {
	/*jshint validthis:true */
	this.status(status || 500).api({
		error: error.toString ? error.toString() : error,
		stack: error.stack || []
	});
}

/**
 * Clears selected paths from object
 * @param {Object} object
 * @param {Array} paths
 * @returns {Object}
 */
function deepClean(object, paths) {
	paths.forEach(function (path) {
		var parts = path.split('.');
		if (parts.length === 1) {
			delete object[path];
		} else {
			var current = parts.shift(),
				next = parts.join('.');
			if (current === '*') {
				return object.forEach(function (value, index) {
					object[index] = deepClean(object[index], [next]);
				});
			}
			object[current] = deepClean(object[current], [next]);
		}
	});
	return object;
}

/**
 * Formats API response
 * @param object
 * @param clear
 * @returns {*}
 */
function apiResponse(object, clear) {
	/*jshint validthis:true */
	var copy = null;
	try {
		copy = JSON.parse(JSON.stringify(object));
		if (clear) {
			copy = deepClean(copy, clear);
		}
	} catch (ex) {
		/* istanbul ignore next */
		return this.error(ex);
	}
	this.setHeader('Content-Type', 'application/json');
	return this.send(JSON.stringify(copy, null, 3));
}

/**
 * Shows paged list of mongoose objects
 * @param req
 * @param model
 * @param query
 * @param populate
 * @param each
 */
function mongooseList(req, model, query, populate, each) {
	/*jshint validthis:true */

	/* istanbul ignore next */
	if (!query) {
		query = {};
	}
	var res = this;
	var limit = +req.query.per_page || 10;
	var page = +req.query.page || 1;
	var sort = req.query.sort || null;
	var skip = (page - 1) * limit;

	model.count(query, function (error, count) {
		/* istanbul ignore next */
		if (error) {
			return res.error(error);
		}
		var cursor = model
			.find(query);

		if (sort) {
			var sortHash = {};
			sort.split(',').forEach(function (elem) {
				var parts = elem.split(':');
				sortHash[parts[0]] = parts[1] || 1;
			});
			cursor = cursor.sort(sortHash);
		}

		cursor = cursor.skip(skip)
			.limit(limit);

		if (populate) {
			populate.forEach(function (path) {
				cursor = cursor.populate(path);
			});
		}

		cursor
			.exec(function (error, list) {
				/* istanbul ignore next */
				if (error) {
					return res.error(error);
				}

				if (!each) {
					return res.api({
						query   : query,
						items   : list,
						total   : count,
						page    : page,
						per_page: limit,
						pages   : Math.ceil(count / limit)
					});
				}

				var i = 0, results = [], current;

				function iterate(err, item) {

					/* istanbul ignore next */
					if (err) return res.error(err);

					if (item) {
						results.push(item);
					} else if (current) {
						results.push(current);
					}


					if (i === list.length) {
						return res.api({
							query   : query,
							items   : results,
							total   : count,
							page    : page,
							per_page: limit,
							pages   : Math.ceil(count / limit)
						});
					}

					current = list[i++];

					each(current, iterate);

				}

				iterate();
			});
	});
}


module.exports = function (app) {

	app.use(function (req, res, next) {
		res.error = errorHandler;
		res.api = apiResponse;
		res.list = mongooseList;
		next();
	});

};
