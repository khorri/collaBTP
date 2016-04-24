/**
* Plan.js
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
        ref: {
			type: 'string'
		},
        project: {
			model: 'project',
            required : true
		},
        mission: {
			model: 'mission'
		},
        level: {
			type: 'string'
		},
        starts: {
			type: 'date',
            defaultsTo: new Date()
		},
        ends: {
			type: 'date'
		},
        editor: {
			model: 'user'
		},
        versions: {
			collection: 'versionPlan',
			via: 'plan'
		},
        status: {
			type: 'string',
            enum: ['new','processing','pendingValidation', 'approved', 'denied'],
			defaultsTo: 'new'
		},
        attachedFiles: {
			collection: 'File',
			via: 'planAttachedFile'
		},
        lastVersion: {
			model: 'versionPlan'
		},
        deleted: {
			type: 'boolean',
			defaultsTo: false
		},

    }
};

