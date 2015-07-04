/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

module.exports = function (app) {

	var type = require('../controllers/type.server.controller'),
		policy = require('../policies/graph.server.policy');

	app.route('/api/graph/type')
		.all(policy.isAllowed)
		.get(type.query)
		.post(type.create);

	app.route('/api/graph/type/:typeId')
		.all(policy.isAllowed)
		.get(type.read)
		.put(type.update)
		.delete(policy.isAllowed, type.delete);

	app.param('typeId', type.byRID);
};
