/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/* istanbul ignore next */
'use strict';


var _               = require('lodash'),
	defaultAssets   = require('./config/assets/default'),
	testAssets      = require('./config/assets/test'),
	gulp            = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	runSequence     = require('run-sequence'),
	plugins         = gulpLoadPlugins(),
	raml            = require('raml-parser'),
	path            = require('path'),
	async           = require('async'),
	chalk           = require('chalk'),
	raml2html       = require('gulp-raml2html'),
	raml2md         = require('raml2md'),
	glob            = require('glob'),
	fs              = require('fs'),
	EOL             = require('os').EOL,
	shutdown        = null;


// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
	process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
	process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
	process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', function () {
	return plugins.nodemon({
		script:   'server.js',
		nodeArgs: ['--debug'],
		ext:      'js,html',
		watch:    _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
	});
});

// Watch Files For Changes
gulp.task('watch', function () {
	// Start livereload
	plugins.livereload.listen();

	// Add watch rules
	gulp.watch(defaultAssets.server.views).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.server.allJS, ['jshint']).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.views).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.js, ['jshint']).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.css, ['csslint']).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.sass, ['sass', 'csslint']).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.less, ['less', 'csslint']).on('change', plugins.livereload.changed);
});

// CSS linting task
gulp.task('csslint', function (done) {
	return gulp.src(defaultAssets.client.css)
		.pipe(plugins.csslint('.csslintrc'))
		.pipe(plugins.csslint.reporter())
		.pipe(plugins.csslint.reporter(function (file) {
			if (!file.csslint.errorCount) {
				done();
			}
		}));
});

// JS linting task
gulp.task('jshint', function () {

	var paths = _.union(
		defaultAssets.server.allJS,
		defaultAssets.client.js,
		testAssets.tests.server,
		testAssets.tests.client,
		testAssets.tests.e2e,
		['!**/*/yql.server.parser.js']
	);

	return gulp.src(paths)
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
		.pipe(plugins.jshint.reporter('fail'));
});


// JS minifying task
gulp.task('uglify', function () {
	return gulp.src(defaultAssets.client.js)
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify({
			mangle: false
		}))
		.pipe(plugins.concat('application.min.js'))
		.pipe(gulp.dest('public/dist'));
});

// CSS minifying task
gulp.task('cssmin', function () {
	return gulp.src(defaultAssets.client.css)
		.pipe(plugins.cssmin())
		.pipe(plugins.concat('application.min.css'))
		.pipe(gulp.dest('public/dist'));
});

// Sass task
gulp.task('sass', function () {
	return gulp.src(defaultAssets.client.sass)
		.pipe(plugins.sass())
		.pipe(plugins.rename(function (path) {
			path.dirname = path.dirname.replace('/scss', '/css');
		}))
		.pipe(gulp.dest('./modules/'));
});

// Less task
gulp.task('less', function () {
	return gulp.src(defaultAssets.client.less)
		.pipe(plugins.less())
		.pipe(plugins.rename(function (path) {
			path.dirname = path.dirname.replace('/less', '/css');
		}))
		.pipe(gulp.dest('./modules/'));
});

// Mocha tests task
gulp.task('mocha', function (done) {
	// Open mongoose connections
	var config = require('./config/config');
	var mongoose = require('./config/lib/mongoose.js');
	var orient = require('./config/lib/orient');
	var error;

	var go = function() {
		// Connect orient
		orient.connect(function () {


			// Connect mongoose
			mongoose.connect(function () {
				// Run the tests
				gulp.src(testAssets.tests.server)
					.pipe(plugins.mocha({
						reporter: 'spec'
					}))
					.on('error', function (err) {
						// If an error occurs, save it
						error = err;
					})
					.on('end', function () {
						// When the tests are done, disconnect mongoose and pass the error state back to gulp
						mongoose.disconnect(function () {
							done(error);
						});
					});
			});
		});
	};

	orient.connection.drop({
		name:     config.orient.database,
		type:     'graph',
		storage:  'plocal', // in further versions it's plocal
		username: config.orient.username,
		password: config.orient.password
	}).then(function () {
		go();
	}, function (e) {
		console.log(chalk.red(e));
		go();
	});

});

gulp.task('raml', function (done) {

	var paths = [];
	var config = require('./config/config');
	var express = require('express')();
	var should = require('should');

	var loadRamlDefinitions = function (callback) {
		async.eachSeries(config.files.server.raml, function (filePath, callback) {
			raml.loadFile(path.resolve(filePath)).then(function (data) {
				paths = paths.concat(data.resources);
				callback();
			}, function (error) {
				console.log('Error parsing: ' + error);
				callback();
			});
		}, callback);
	};

	var loadRoutes = function (callback) {
		config.files.server.routes.forEach(function (filePath) {
			require(path.resolve(filePath))(express);
		});
		callback();
	};

	var ramlToExpress = function (path) {
		var z = path.replace(/\{(.+?)\}/g, ':$1');
		return z;
	};

	var expressToRaml = function (path) {
		var z = path.replace(/:([a-zA-Z0-9-]+)/g, '{$1}');
		return z;
	};


	var validateRoutes = function (callback) {
		// check RAML against express
		express._router.stack.forEach(function (item) {
			if (item.route) {
				var registeredInRaml = false;
				var expressPath = expressToRaml(item.route.path);

				paths.forEach(function (route) {
					if (route.relativeUri === expressPath) {
						Object.keys(item.route.methods).forEach(function (expressMethod) {
							if (expressMethod !== '_all') {
								var methodFound = false;
								route.methods.forEach(function (ramlMethod) {
									if (ramlMethod.method === expressMethod) {
										methodFound = true;
									}
								});
								if (!methodFound) {
									console.log(chalk.yellow('In Path `' + item.route.path + '` method `' +
									expressMethod + '` is not defined in RAML'));
								}
							}
						});
						registeredInRaml = true;
					}
				});
				if (!registeredInRaml) {
					console.log(chalk.yellow('Path `' + item.route.path + '` is not registed in RAML'));
				}
			}
		});

		// check express against RAML
		paths.forEach(function (route) {
			var relativeUri = ramlToExpress(route.relativeUri);
			route.methods.forEach(function (ramlMethod) {
				var registedInExpress = false
				express._router.stack.forEach(function (item) {
					if (item.route) {
						if (relativeUri === item.route.path && item.route.methods[ramlMethod.method]) {
							registedInExpress = true;
						}
					}
				});
				if (!registedInExpress) {
					console.log(chalk.yellow('In Path `' + route.relativeUri + '` method `' +
					ramlMethod.method + '` is not defined in Express'));
				}
			});
		});
		callback();
	};

	var mongoose = require('./config/lib/mongoose.js');
	var error;

	// Connect mongoose
	mongoose.connect(function () {
		loadRamlDefinitions(function () {
			loadRoutes(function () {
				validateRoutes(function () {
					mongoose.disconnect(function () {
						done(error);
					});
				});
			});
		});
	});
});

// Karma test runner task
gulp.task('karma', function (done) {
	return gulp.src([])
		.pipe(plugins.karma({
			configFile: 'karma.conf.js',
			action:     'run',
			singleRun:  true
		}));
});

// Selenium standalone WebDriver update task
gulp.task('webdriver-update', plugins.protractor.webdriver_update);

// Protractor test runner task
gulp.task('protractor', function () {
	gulp.src([])
		.pipe(plugins.protractor.protractor({
			configFile: 'protractor.conf.js'
		}))
		.on('error', function (e) {
			throw e;
		});
});

// Lint CSS and JavaScript files.
gulp.task('lint', function (done) {
	runSequence('less', 'sass', ['csslint', 'jshint'], done);
});

// Lint project files and minify them into two production files.
gulp.task('build', function (done) {
	runSequence('env:dev', 'lint', ['uglify', 'cssmin'], done);
});

// Run the project tests
gulp.task('test', function (done) {
	runSequence('env:test', 'lint', ['karma', 'mocha'], 'server', 'abao', 'kill', done);
});

// Run the project tests
gulp.task('test-server', function (done) {
	runSequence('env:test', 'mocha', 'server', 'abao', 'kill', done);
});

// Run the project in development mode
gulp.task('default', function (done) {
	runSequence('env:dev', 'lint', ['nodemon', 'watch'], done);
});

gulp.task('api', function (done) {
	runSequence('env:test', 'server', 'abao', 'kill', done);
});

gulp.task('abao', function (done) {
	var config = require('./config/config'),
		Abao = require('abao');

	async.eachSeries(config.files.server.raml, function (filePath, callback) {

		var abao = new Abao({
			'ramlPath': filePath,
			'server':   'http://localhost:3001',
			'options':  {
				hookfiles: 'modules/**/server/routes/*.hook.*'
			}
		});

		abao.run(function (error, failures) {
			if (error) {
				if (error.message) {
					console.error(error.message);
				}
				if (error.stack) {
					console.error(error.stack);
				}
				return done(error);
			}
			if (failures > 0) {
				return done(failures);
			} else {
				callback();
			}
		});
	}, done);
});

gulp.task('server', function (done) {
	require('./server').then(function (server) {
		console.log('running');
		shutdown = server.close;
		done();
	}, done);
});

gulp.task('kill', function (done) {
	try {
		shutdown(done);
	} catch (e) {
		done();
		process.exit(0);
	}
});

// Run the project in debug mode
gulp.task('debug', function (done) {
	runSequence('env:dev', 'lint', ['nodemon', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
	runSequence('build', 'lint', ['nodemon', 'watch'], done);
});

gulp.task('modules-raml', function (done) {
	var config = require('./config/config');

	function generate(list, title, destination, callback) {
		var paths = [];
		try {
			async.eachSeries(list, function (filePath, callback) {
				raml.loadFile(path.resolve(filePath)).then(function (data) {
					paths = paths.concat(data.resources);
					callback();
				}, function (error) {
					callback(error);
				});
			}, function () {
				var lines = '#%RAML 0.8' + EOL +
					'title: ' + title + EOL + '' + EOL;

				function crawl(indent, object) {
					if (object && typeof object === 'object') {

						var prefix = '';
						for (var i = 0; i < indent; i++) prefix += '  ';
						Object.keys(object).forEach(function (key) {
							lines += prefix + key + ':' + EOL;
							crawl(indent + 1, object[key]);
						});
					}
				}


				paths.forEach(function (path) {
					lines += path.relativeUri + ':\n';
					path.methods.forEach(function (method) {
						lines += '  ' + method.method + ':' + EOL;
						if (method.description) {
							lines += '    description: \'' + method.description + '\'' + EOL;
						}
						if (method.responses) {
							lines += '    responses:' + EOL;
							crawl(3, method.responses);
						}
					});
				});
				console.log(chalk.green('Saving to ' + destination));
				fs.writeFile(destination, lines, 'utf8', callback);
			});
		} catch (e) {
			console.log(e);
			console.log(e.stack);
		}
	}

	generate(config.files.server.raml, 'Memeto API', __dirname + '/docs/raml/api.raml', function () {
		generate(config.files.server.clientRAML, 'Memeto Front-End', __dirname + '/docs/raml/frontend.raml', done);
	});
});

gulp.task('raml-html', function () {
	return gulp.src('docs/raml/*.raml')
		.pipe(raml2html())
		.pipe(gulp.dest('docs/raml'));
});

gulp.task('raml-md', function (done) {

	var raml2md = require('raml2md'),
		config = raml2md.getDefaultConfig(),
		paths = glob.sync('docs/raml/*.raml');

	function it() {
		var path = paths.shift();
		if (!path) return done();
		raml2md.render(path, config).then(function (result) {
			fs.writeFile(path.replace(/\.raml$/, '.md'), result, 'utf8', function () {
				it();
			});
		}, done);
	}

	it();
});

gulp.task('apidoc', function (done) {
	runSequence('modules-raml', 'raml-html', 'raml-md', done);
});
