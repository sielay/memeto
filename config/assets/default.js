/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

module.exports = {
	client: {
		lib:   {
			css:   [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/angular-json-tree/build/angular-json-tree.css',
				'public/lib/font-awesome/css/font-awesome.min.css',
				'http://fonts.googleapis.com/css?family=Amatic+SC',
				'public/lib/angular-growl-v2/build/angular-growl.min.css',
				'public/lib/vis/dist/vis.min.css',
				'public/lib/bootstrap-social/bootstrap-social.css'

			],
			js:    [
				'public/lib/angular/angular.js',
				'public/lib/angular-local-storage/dist/angular-local-storage.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-file-upload/angular-file-upload.js',
				'public/lib/angular-json-tree/build/angular-json-tree.min.js',
				'public/lib/angular-growl-v2/build/angular-growl.min.js',
				'public/lib/angular-utils-ui-breadcrumbs/uiBreadcrumbs.js',
				'public/lib/vis/dist/vis.min.js',
				'public/lib/font-icon-convert/dist/index.js'

			],
			tests: ['public/lib/angular-mocks/angular-mocks.js']
		},
		css:   [
			'modules/*/client/css/*.css'
		],
		less:  [
			'modules/*/client/less/*.less'
		],
		sass:  [
			'modules/*/client/scss/*.scss'
		],
		js:    [
			'modules/core/client/app/config.js',
			'modules/core/client/app/init.js',
			'modules/*/client/*.js',
			'modules/*/client/**/*.js'
		],
		views: ['modules/*/client/views/**/*.html']
	},
	server: {
		allJS:             ['gruntfile.js', 'server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
		models:            'modules/*/server/models/**/*.js',
		routes:            ['modules/!(core)/server/routes/**/*.routes.js', 'modules/core/server/routes/**/*.routes.js'],
		raml:              ['modules/*/server/routes/**/*.raml'],
		clientRAML:        ['modules/*/client/routes/**/*.raml'],
		sockets:           'modules/*/server/sockets/**/*.js',
		config:            'modules/*/server/config/*.js',
		policies:          'modules/*/server/policies/*.js',
		views:             'modules/*/server/views/*.html',
		orientoMigrations: 'modules/!(core)/server/models/migrations'
	}
};
