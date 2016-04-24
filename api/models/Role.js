/**
 * Role.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    schema: true,
    attributes: {
        title: {
            type: 'string',
            required: true
        },
        description: {
            type: 'string'
        },
        users: {
            collection: 'User',
            via: 'role'
        },
        permissions: {
            collection: 'Permission',
            via: 'roles'
        },
        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        }
    }
};

