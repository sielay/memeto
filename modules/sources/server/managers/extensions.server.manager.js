/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

var
	fs         = require('fs'),
	path       = require('path'),
	Type       = require('../../../graph/server/models/type.server.model'),
	extensions = {},
	chalk      = require('chalk'),
	async      = require('async');

fs.readdir(path.resolve(__dirname + '/../../../../extensions'), function (err, list) {
	if (err) {
		console.log(chalk.red(err));
		process.exit(1);
	}
	async.eachSeries(list, function (current, next) {
		try {
			extensions[current] = require('../../../../extensions/' + current);
			console.log(chalk.green('Loaded extension: ' + current));
			next();
		} catch (err) {
			console.log(chalk.red('Error loading extension: ' + current));
			console.log(chalk.red(err));
			next();
		}
	}, function (err) {
		if (err) {
			console.log(chalk.red(err));
			process.exit(1);
		}
	});
});

module.exports.resourceTypes = function (callback) {
	var list = [];
	Object.keys(extensions).forEach(function (extension) {
		list = list.concat(extensions[extension].resourceTypes());
	});
	callback(null, list);
};

