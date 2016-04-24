/**
 * PaymentMethod.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema: true,
	attributes: {
		label: {
			type: 'string',
			required: true
		},
		percentage: {
			type: 'float',
			required: true
		},
		subProject: {
			model: 'SubProject',
		},
		isDeleted: {
			type: 'boolean',
			defaultsTo: false
		},
		bill: {
			model: 'Bill'
		}
	},
	afterDestroy: function (pm, cb) {
		Bill.update({
			id: pm[0].bill,
			isObsolete: false
		}, {
			isObsolete: true
		}).exec(function (err) {
			cb();
		})
	}
};