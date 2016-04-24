/**
 * Participant.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    schema: true,
    attributes: {
        contactPerson: {
            type: 'string',
            required: true
        },
        company: {
            type: 'string',
            required: true
        },
        description: {
            type: 'string'
        },
        email: {
            type: 'string',
            email: true,
            required: true,
            unique: true
        },
        phone: {
            type: 'string'
        },
        cellphone: {
            type: 'string'
        },
        url: {
            type: 'string'
        },
        address: {
            type: 'string'
        },
        zip: {
            type: 'string'
        },
        city: {
            type: 'string'
        },
        country: {
            type: 'string'
        },
        state: {
            type: 'string',
        },
        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        },
        type: {
            model: 'Type',
            required: true
        },
        projects: {
            collection: 'Project',
            via: 'participants'
        },
        assignedDocs: {
            collection: 'DocExamination',
            via: 'sentTo',
            dominant: true
        }
    }
};