/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

module.exports = function (app) {

	var entity = require('../controllers/entity.server.controller'),
		policy = require('../policies/graph.server.policy');

	app.route('/api/graph/entity')
		.all(policy.isAllowed)
		.get(entity.query)
		.post(entity.create);

	app.route('/api/graph/entity/:rid')
		.all(policy.isAllowed)
		.get(entity.read)
		.put(entity.update)
		.post(entity.link)
		.delete(policy.isAllowed, entity.delete);

	app.param('rid', entity.byRID);
};
