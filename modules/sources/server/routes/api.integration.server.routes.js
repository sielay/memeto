/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

var mongoose       = require('mongoose'),
	ApiIntegration = mongoose.model('ApiIntegration');

module.exports = function (app) {

	var policy = require('../policies/api.integration.server.policy');

	app.route('/api/integration/providers')
		.get(policy.isAllowed, function (req, res) {
			//TODO: move somewhere
			res.api({
				'github': 'GitHub / GitHub Enterprise',
				'slack':  'Slack',
				'trello': 'Trello'
			});
		});

	app.crud('/api/integration/:integrationId', ApiIntegration, [policy.isAllowed]);
};
