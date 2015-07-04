/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
/*jshint expr: true*/
'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * Globals
 */
var user, user2, oauthUserData;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function () {
	before(function (done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local',
			confirmed: true
		});
		done();
	});

	describe('Method Save', function () {
		it('should begin with no users', function (done) {
			User.remove({}, function(err) {
				if(err) return done(err);
				User.find({}, function (err, users) {
					users.should.have.length(0);
					done();
				});
			});
		});

		it('should be able to save without problems', function (done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function (done) {
			user.save(function () {
				user2.save(function (err) {
					should.exist(err);
					done();
				});
			});
		});

		it('should allow to add oauth account to existing user', function (done) {
			User.oAuthHandle(user, 'facebook', '1234567890', 'abcdefghijkl', 'abcdefghijkl9', {}, {}, done);
		});

		it('should allow to create other user with different oauth id', function (done) {
			User.oAuthHandle(null, 'facebook', '0987654321', 'abcdefghijkl', 'abcdefghijkl9', {}, {}, function (error, newUser) {
				if (error) {
					return done(error);
				}
				oauthUserData = newUser;
				should(oauthUserData._id).not.eql(user._id);
				done();
			});
		});

		it('should verify which user has confirmed identity', function (done) {
			should(user.isIdentityConfirmed(User.EMAIL)).be.false;
			should(user2.isIdentityConfirmed(User.EMAIL)).be.false;
			user.setIdentityConfirmed(User.EMAIL, null, true);
			user.save(function (error, _user) {
				should.not.exist(error);
				should(_user.isIdentityConfirmed(User.EMAIL)).be.true;
				done();
			});

		});

		it('should allow to update provider data and token', function (done) {
			User.oAuthHandle(user, 'facebook', '1234567890', '13579', 'abcdefghijkl9', {someData: 222}, {}, function (error, newUser) {
				var fbdata = newUser.getIdentity('facebook');
				should(fbdata.accessToken).eql('13579');
				should(fbdata.providerData.someData).eql(222);
				done();
			});
		});

		it('shouldn\'t allow to use one provider/id for two users', function (done) {
			User.oAuthHandle(user, 'facebook', '0987654321', 'abcdefghijkl', 'abcdefghijkl9', {}, {}, function (error, newUser) {
				should.exist(error);
				done();
			});
		});


	});

	after(function (done) {
		User.remove().exec(done);
	});
});
