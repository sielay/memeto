/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */


'use strict';

var META_NS = 'slack:',
	ACCOUNT = META_NS + 'account',
	TEAM    = META_NS + 'team',
	CHANNEL = META_NS + 'channel';

module.exports.resourceTypes = function () {
	return [
		{
			label: 'Slack Team',
			meta:  TEAM
		}
	];
};
