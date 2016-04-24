/**
 * Bill.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema: true,
	attributes: {
		title: {
			type: 'string',
		},
		amount: {
			type: 'float',
			required: true
		},
		description: {
			type: 'string'
		},
		isPaid: {
			type: 'boolean',
			defaultsTo: false
		},
		isEdited: {
			type: 'boolean',
			defaultsTo: false
		},
		isObsolete: {
			type: 'boolean',
			defaultsTo: false
		},
		subProject: {
			model: 'SubProject',
		},
		paymentMethods: {
			collection: 'PaymentMethod',
			via: 'bill',
		},
		status: {
			type: 'string',
			defaultsTo: 'Non payée'
		},
		invoice: {
			model: 'File',
		}
	},
	beforeCreate: function (values, next) {
		var amount = 0;
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth() + 1 + "";
		var day = d.getDate();
		var hour = d.getHours();
		var min = d.getMinutes();
		var sec = d.getSeconds();

		year = year.toString().substr(2, 2);
		if (month.length == 1) {
			month = "0" + month;
		}
		day = day + "";

		if (day.length == 1) {
			day = "0" + day;
		}
		hour = hour + "";

		if (hour.length == 1) {
			hour = "0" + hour;
		}

		min = min + "";

		if (min.length == 1) {
			min = "0" + min;
		}

		sec = sec + "";

		if (min.length == 1) {
			sec = "0" + sec;
		}

		values.title = 'FAC' + year + month + day + hour + min + sec;
		next();
	},
};