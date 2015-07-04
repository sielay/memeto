/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

module.exports = {
	app: {
		title: 'MeetMyTeam - Makes real relation within organisation',
		description: 'Roles, Assets and Members Directory for your organisation',
		keywords: 'slack, acl, roles, teams, scrum, kanban, corpo, corporation, line, manager',
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions'
};
