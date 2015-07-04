/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

var config  = require('../config'),
	chalk   = require('chalk'),
	path    = require('path'),
	oriento = require('oriento');

module.exports.connection = oriento({
	host    : config.orient.host,
	port    : config.orient.port,
	username: config.orient.username,
	password: config.orient.password
});

module.exports.db = null;

module.exports.connect = function (callback) {


	var server = module.exports.connection;

	function migrate() {
		if (!config.files.server.orientoMigrations || !config.files.server.orientoMigrations.length) return callback();
		var next = config.files.server.orientoMigrations.shift(),
			migrationDir = path.resolve(__dirname + '/../../'+next);
		console.log(chalk.yellow('Migrating from ' + migrationDir));
		(new oriento.Migration.Manager({
			db : exports.db,
			dir: migrationDir
		})).up(10000).then(function () {
			console.log(chalk.green('Migrated from ' + migrationDir));
			migrate();
		}, function (err) {
			/* istanbul ignore next */
			console.log(chalk.red(err));
			/* istanbul ignore next */
			process.exit(-1);
		});

	}

	function selectDB() {
		module.exports.db = server.use({
			name    : config.orient.database,
			username: config.orient.username,
			password: config.orient.password
		});
		console.log(chalk.yellow('Selecting Orient database ' + config.orient.database));

		migrate();
	}

	server.list().then(function (dbs) {
		var dbInstalled = false;
		dbs.forEach(function (db) {
			if (db.name === config.orient.database) {
				dbInstalled = true;
			}
		});
		if (dbInstalled) return selectDB();

		console.log(chalk.yellow('Creating new Orient database ' + config.orient.database));
		try {
			server.create({
				name    : config.orient.database,
				type    : 'graph',
				storage : 'plocal', // in further versions it's plocal
				username: config.orient.username,
				password: config.orient.password
			})
				.then(function (db) {
					console.log(chalk.green('Created new Orient database ' + db.name));
					selectDB();
				}, function (err) {
					/* istanbul ignore next */
					console.log(chalk.red('Had error'));
					/* istanbul ignore next */
					console.log(chalk.red(err));
				});
		} catch (e) {
			/* istanbul ignore next */
			console.log(chalk.red('Had error'));
			/* istanbul ignore next */
			console.log(chalk.red(e));
		}
	});
};
