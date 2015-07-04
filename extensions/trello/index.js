/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */


'use strict';

var META_NS = 'trello:',
	ACCOUNT = META_NS + 'account',
	ORG     = META_NS + 'organisation',
	BOARD   = META_NS + 'board';

module.exports.resourceTypes = function () {
	return [
		{
			label: 'Trello Account',
			meta:  ACCOUNT
		},
		{
			label: 'Trello Board',
			meta:  BOARD
		},
		{
			label: 'Trello Organization',
			meta:  ORG
		}
	];
};
