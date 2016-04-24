/**
 * DocExamination.js
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
        description: {
            type: 'text'
        },
        mailNum: {
            type: 'integer'
        },
        project: {
            model: 'Project'
        },
        outputFile: {
            model: 'File'
        },
        isDeleted: {
            type: 'boolean',
            defaultsTo: 'false'
        },
        sentTo: {
            collection: 'Participant',
            via: 'assignedDocs'
        },
		contributor: {
			model: 'User'
		},

    }
};