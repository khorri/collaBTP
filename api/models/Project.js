/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var moment = require('moment');
module.exports = {
	schema: true,
	attributes: {
		ref: {
			type: 'string'
		},
		name: {
			type: 'string',
			required: true
		},
		desc: {
			type: 'text'
		},
		status: {
			type: 'string',
			defaultsTo: 'new'
		},
		city: {
			type: 'text'
		},
		address: {
			type: 'text'
		},
		starts: {
			type: 'date',
			defaultsTo: new Date()
		},
		ends: {
			type: 'date'
		},
        duration : {
            type: 'float',
            defaultsTo: 0.0
        },
		tasks: {
			collection: 'Task',
			via: 'project'
		},
		owner: {
			model: 'User'
		},
		projectLeader: {
			model: 'User',
			required: true
		},
		contributors: {
			collection: 'User',
			via: 'assignedProjects'
		},
		customer: {
			model: 'Customer'
		},
		participants: {
			collection: 'Participant',
			via: 'projects',
			dominant: true
		},
		isDeleted: {
			type: 'boolean',
			defaultsTo: false
		},
		docExaminations: {
			collection: 'DocExamination',
			via: 'project'
		},
		descriptionFiles: {
			collection: 'DescriptionFile',
			via: 'project'
		},
		activities: {
			collection: 'Activity',
			via: 'project'
		},
		subProjects: {
			collection: 'SubProject',
			via: 'project'
		},
        plans: {
           collection:'Plan',
           via: 'project',    
        },
        documents: {
            collection: 'File',
            via: 'project'
        }
	},


	beforeCreate: function (values, next) {
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth() + 1 + "";
		var day = d.getDate();
		var hour = d.getHours();
		var min = d.getMinutes();

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
		values.ref = "AF" + year + month + day + hour + min;
		next();
	},

	afterCreate: function (record, next) {
		moment.locale('fr');
		next();
	}

};