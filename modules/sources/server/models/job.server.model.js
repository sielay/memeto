/**
 * @copyright SIELAY Ltd
 * Dual Licence, @see /LICENSE.md
 */
'use strict';

var mongoose = require('mongoose'),
	JobSchema,
	JobModel;

JobSchema = new mongoose.Schema({
	name:            {
		type: String
	},
	integration:     {
		type: mongoose.Schema.Types.ObjectId,
		ref:  'ApiIntegration'
	},
	resourceType:    {
		type: String
	},
	resourceUri:     {
		type: String
	},
	recurrent:       {
		type: Boolean
	},
	recurrencyLimit: {
		type: Number
	},
	token:           {
		type: String
	}
});

module.exports = JobModel = mongoose.model('Job', JobSchema);
