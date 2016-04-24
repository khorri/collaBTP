/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema: true,

	attributes: {
		name: {
			type: 'string',
			required: true
		},
		title: {
			type: 'string'
		},
		email: {
			type: 'string',
			email: true,
			required: true,
			unique: true
		},
		photo: {
			model: 'File'
		},
		phone: {
			type: 'string'
		},
		role: {
			model: 'Role'
		},
		bio: {
			type: 'text'
		},
		encryptedPassword: {
			type: 'string'
		},
		online: {
			type: 'boolean',
			defaultsTo: false
		},
		logoutAt: {
			type: 'date',
			defaultsTo: new Date()
		},

        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        },
		sentMsg: {
			collection: 'Message',
			via: 'to'
		},
		receivedMsg: {
			collection: 'Message',
			via: 'from'
		},
		activities: {
			collection: 'Activity',
			via: 'contributor'
		},
		assignedProjects: {
			collection: 'Project',
			via: 'contributors',
			dominant: true
		},
		settings: {
			model: 'Settings'
		},
		myProjects: {
			collection: 'Project',
			via: 'owner'
		},
		descriptionFiles: {
			collection: 'DescriptionFile',
			via: 'createdBy'
		},
        comments :{
            collection: 'Comment',
            via: 'sender'
        },
		toJSON: function () {
			var obj = this.toObject();
			delete obj.password;
			delete obj.confirmation;
			delete obj.encryptedPassword;
			delete obj.settings;
			delete obj._csrf;
			return obj;
		}
	},

	beforeCreate: function (values, next) {

		if (!values.password || values.password != values.confirmation) {
			return next({
				err: ["Password doesn't match password confirmation."]
			});
		}

		require('bcryptjs').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
			if (err) return next(err);

			values.encryptedPassword = encryptedPassword;
			next();
		});
	},
	beforeUpdate: function (values, next) {

		if (values.password) {
			require('bcryptjs').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
				if (err) return next(err);
                else {
                    values.encryptedPassword = encryptedPassword;
                    //next();
                }
			});
		}
		next();
	}
};