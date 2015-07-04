/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

var mongoose = require('mongoose'),
	passport = require('passport'),
	ApiIntegrationSchema,
	path     = require('path'),
	ApiIntegrationModel;

ApiIntegrationSchema = new mongoose.Schema({
	name:         {
		type:     String,
		required: true
	},
	provider:     {
		type:     String,
		required: true
	},
	clientID:     {
		type: String
	},
	clientSecret: {
		type: String
	},
	endpoint:     {
		type: String
	},
	allowOAuth2:  {
		type: Boolean
	}
});

ApiIntegrationSchema.post('init', function () {
	this._original = this.toObject();
});

ApiIntegrationSchema.post('save', function (doc) {
	if (this._original) {
		passport.unuse(this._original.name);
	}
	try {
		var strategyPath = path.resolve(path.join(__dirname, '../../../users/server/config/dynamic-strategies/' + this.provider + '.js'));
		require(strategyPath)(this);
		this._original = doc;
	} catch (ex) {
		/* istanbul ignore next */
		console.error(ex);
		/* istanbul ignore next */
		console.error(ex.stack);
	}
});

module.exports = ApiIntegrationModel = mongoose.model('ApiIntegration', ApiIntegrationSchema);
