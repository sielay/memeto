/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

module.exports = {
	client: {
		lib  : {
			css  : [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/angular-json-tree/build/angular-json-tree.css',
				'public/lib/font-awesome/css/font-awesome.min.css',
				'http://fonts.googleapis.com/css?family=Amatic+SC',
				'public/lib/angular-growl-v2/build/angular-growl.min.css',
				'public/lib/vis/dist/vis.min.css',
				'public/lib/bootstrap-social/bootstrap-social.css'

			],
			js   : [
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

			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	}
};
