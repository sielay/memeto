#!/usr/bin/env node

/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var cliArgs = require('command-line-args'),
	chalk   = require('chalk'),
	Manager = require('oriento').Migration.Manager,
	orient  = require('./config/lib/orient'),
	oriento = require('oriento');

/* define the command-line options */
var cli = cliArgs([
	{name: 'action', type: String, alias: 'a', description: 'Action', defaultOption: true},
	{name: 'module', type: String, alias: 'm', description: 'Module'},
	{name: 'name', type: String, alias: 'n', description: 'Name'},
	{name: 'env', type: String, alias: 'e', description: 'Environment'},
	{name: 'user', type: String, alias: 'u', description: 'User'},
	{name: 'password', type: String, alias: 'p', description: 'Password'}
]);

/* parse the supplied command-line values */
try {
	var options = cli.parse();
} catch (e) {
	console.error(chalk.red(e));
	return;
}

if (options.env) {
	process.env.NODE_ENV = options.env;
}

switch (options.action) {
	case 'create':
		if (!options.module) return console.log(chalk.red('You have to name module'));
		if (!options.name) return console.log(chalk.red('You have to name migration'));

		orient.connect(function () {
			(new Manager({
				db:  module.exports.db,
				dir: __dirname + '/modules/' + options.module + '/server/models/migrations'
			})).create(options.name).then(function (filename) {
					console.log(chalk.green('Migration created ') + chalk.yellow(filename));
					process.exit(0);
				}, function (err) {
					console.log(chalk.red(err));
					process.exit(-1);
				});

		});

		break;
	case 'nuke':
		if (!options.user) return console.log(chalk.red('You have to give user'));
		if (!options.password) return console.log(chalk.red('You have to give password'));
		if (!options.name) return console.log(chalk.red('You have to name database'));

		var server = oriento({
			host    : 'localhost',
			port    : 2424,
			username: options.user,
			password: options.password
		});

		console.log(options);

		var create = function() {
			server.create({
				name    : options.name,
				type    : 'graph',
				storage : 'plocal',
				username: options.user,
				password: options.password
			}).then(function (db) {
				console.log(chalk.green('Created new Orient database ' + db.name));
			}, function (err) {
				console.log(chalk.red('Had error'));
				console.log(chalk.red(err));
			});
		};

		server.drop({
			name    : options.name,
			storage : 'plocal',
			username: options.user,
			password: options.password
		})
			.then(function (db) {
				console.log(chalk.green('Dropped new Orient database ' + db.name));
				create();
			}, function (err) {
				console.log(chalk.red('Had error'));
				console.log(chalk.red(err));
				create();
			});
		break;
	default:
		console.log(chalk.red('Undefined action'));
		process.exit(-1);
}
