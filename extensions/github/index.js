/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */


'use strict';

var META_NS    = 'github:',
	ACCOUNT    = META_NS + 'account',
	ORG        = META_NS + 'organisation',
	REPOSITORY = META_NS + 'repository';

module.exports.resourceTypes = function () {
	return [
		{
			label: 'GitHub Account',
			meta:  ACCOUNT
		},
		{
			label: 'GitHub Organisation',
			meta:  ORG
		},
		{
			label: 'GitHub Repository',
			meta:  REPOSITORY
		}
	];
};
