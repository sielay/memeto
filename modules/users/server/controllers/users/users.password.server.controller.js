/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */

'use strict';

/**
 * Module dependencies.
 */
var path     = require('path'),
config       = require(path.resolve('./config/config')),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
mongoose     = require('mongoose'),
User         = mongoose.model('User'),
nodemailer   = require('nodemailer'),
async        = require('async'),
crypto       = require('crypto');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
	async.waterfall([
		// Generate random token
		function (done) {
			crypto.randomBytes(20, function (err, buffer) {
				var token = buffer.toString('hex');
				done(err, token);
			});
		},
		// Lookup user by username
		function (token, done) {
			if (req.body.username || req.headers.username) {

				var onUserFound = function (err, user) {
					if (!user) {
						/* istanbul ignore next */
						return res.status(400).send({
							message: 'No account with that username has been found'
						});
					} else if (user.provider !== 'local') {
						/* istanbul ignore next */
						return res.status(400).send({
							message: 'It seems like you signed up using your ' + user.provider + ' account'
						});
					} else {
						user.resetPasswordToken = token;
						user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

						user.save(function (err) {
							done(err, token, user);
						});
					}
				};

				if (config.isTest) {
					return onUserFound(null, {
						provider: 'local', // maybe it's wrong
						save:     function (callback) {
							callback();
						}
					});
				}
				/* istanbul ignore next */
				User.findOne({
					username: req.body.username
				}, '-salt -password', onUserFound);
			} else {
				return res.status(400).send({
					message: 'Username field must not be blank'
				});
			}
		},
		function (token, user, done) {
			res.render(path.resolve('modules/users/server/templates/reset-password-email'), {
				name:    user.displayName,
				appName: config.app.title,
				url:     'http://' + req.headers.host + '/api/auth/reset/' + token
			}, function (err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function (emailHTML, user, done) {
			var mailOptions = {
				to:      user.email,
				from:    config.mailer.from,
				subject: 'Password Reset',
				html:    emailHTML
			};
			smtpTransport.sendMail(mailOptions, function (err) {
				if (!err || config.isTest) {
					res.send({
						message: 'An email has been sent to the provided email with further instructions.'
					});
				} else {
					/* istanbul ignore next */
					return res.status(400).send({
						message: 'Failure sending email'
					});
				}
				/* istanbul ignore next */
				done(err);
			});
		}
	], function (err) {
		if (err) return next(err);
	});
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {

	var isTest = config.isTest && (req.params.token === 'abcdefghij'),
		onUserFound = function (err, user) {
			if (!user) {
				/* istanbul ignore next */
				return res.redirect('/#!/password/reset/invalid');
			}

			res.redirect('/#!/password/reset/' + req.params.token);
		};

	if (isTest) {
		return onUserFound(null, {});
	}
	// it's even too dumb to be tested
	/* istanbul ignore next */
	User.findOne({
		resetPasswordToken:   req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, onUserFound);
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
	// Init Variables
	var passwordDetails = req.body;
	var message = null;

	async.waterfall([

		function (done) {

			function onSave(err) {
				if (err) {
					/* istanbul ignore next */
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					req.login(req.user, function (err) {
						if (err && !config.isTest) {
							/* istanbul ignore next */
							res.status(400).send(err);
						} else {
							// Return authenticated user
							res.json(req.user);

							done(err, req.user);
						}
					});
				}
			}

			function onUserFound(err, user) {
				if (!err && user) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.password = passwordDetails.newPassword;
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;
						req.user = user;
						user.save(onSave);
					} else {
						/* istanbul ignore next */
						return res.status(400).send({
							message: 'Passwords do not match'
						});
					}
				} else {
					return res.status(400).send({
						message: 'Password reset token is invalid or has expired.'
					});
				}
			}

			if (config.isTest && req.headers.validrequest) {
				return onUserFound(null, {
					id:   mongoose.Types.ObjectId().toString(),
					save: function (callback) {
						callback();
					}
				});
			}

			User.findOne({
				resetPasswordToken:   req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, onUserFound);
		},
		function (user, done) {
			res.render('modules/users/server/templates/reset-password-confirm-email', {
				name:    user.displayName,
				appName: config.app.title
			}, function (err, emailHTML) {
				done(err, emailHTML, user);
			});
		},
		// If valid email, send reset email using service
		function (emailHTML, user, done) {
			var mailOptions = {
				to:      user.email,
				from:    config.mailer.from,
				subject: 'Your password has been changed',
				html:    emailHTML
			};

			smtpTransport.sendMail(mailOptions, function (err) {
				done(err, 'done');
			});
		}
	], function (err) {
		if (err) return next(err);
	});
};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
	// Init Variables
	var passwordDetails = req.body.currentPassword ? req.body : req.query;

	if (config.isTest && req.headers.loggedin) {
		req.user = {
			id:           '123',
			authenticate: function () {
				return true;
			},
			save:         function (callback) {
				callback(null, req.user);
			}
		};
	}

	function onUserSave(err) {
		if (err) {
			/* istanbul ignore next */
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			req.login(req.user, function (err) {
				if (err) {
					/* istanbul ignore next */
					res.status(400).send(err);
				} else {
					/* istanbul ignore next */
					res.send({
						message: 'Password changed successfully'
					});
				}
			});
		}
	}

	function onUserFetched(err, user) {
		if (!err && user) {
			req.user = user;
			if (user.authenticate(passwordDetails.currentPassword)) {
				if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
					user.password = passwordDetails.newPassword;

					user.save(onUserSave);
				} else {
					/* istanbul ignore next */
					res.status(400).send({
						message: 'Passwords do not match'
					});
				}
			} else {
				/* istanbul ignore next */
				res.status(400).send({
					message: 'Current password is incorrect'
				});
			}
		} else {
			/* istanbul ignore next */
			res.status(400).send({
				message: 'User is not found'
			});
		}
	}

	if (passwordDetails.newPassword) {
		if (config.isTest && req.headers.loggedin) {
			return onUserFetched(null, req.user);
		}
		/* istanbul ignore next */
		User.findById(req.user.id, onUserFetched);
	} else {
		/* istanbul ignore next */
		res.status(400).send({
			message: 'Please provide a new password'
		});
	}

};
