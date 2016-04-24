/**
 * SubProject.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		project: {
			model: 'Project',
			required: true
		},
		budget: {
			type: 'float',
			defaultsTo: 0.0
		},
		contract: {
			model: 'File'
		},
		isContratGen: {
			type: 'boolean',
			defaultsTo: false
		},
		signedContract: {
			model: 'File'
		},
		missions: {
			collection: 'Mission',
			via: 'subProjects'
		},
		paymentMethods: {
			collection: 'PaymentMethod',
			via: 'subProject',
		},
		bills: {
			collection: 'Bill',
			via: 'subProject'
		},
		isDeleted: {
			type: 'boolean',
			defaultsTo: false
		},
	}
};