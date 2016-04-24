/**
 * File.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var fs = require('fs');
module.exports = {
    schema: true,
    attributes: {
        name: {
            type: 'string',
            required: true
        },
        nameInDisk: {
            type: 'string',
            required: true
        },
        type: {
            type: 'string'
        },
        ext: {
            type: 'string'
        },
        size: {
            type: 'integer'
        },
        description: {
            type: 'string'
        },
        webPath: {
            type: 'string',
            required: true
        },
        absolutePath: {
            type: 'string'
        },
        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        },
        subProject: {
            model: 'SubProject'
        },
        activity: {
            model: 'Activity'
        },
        createdBy: {
            model: 'User'
        },
        attachmentsComment : {
            model : 'Comment'
        },
        planAttachedFile:{
            model:'Plan'
        },
        project: {
            model: 'project'
        },
        versions: {
            collection: 'FileVersion',
            via: 'file'
        },
        lastVersion: {
            type: 'string'
        },
        title:{
            type: 'string'
        }
    },
    afterDestroy: function (destroyedRecords, callback) {
        destroyedRecords.forEach(function (file, index) {
            if(fs.existsSync(file.absolutePath)) {
                fs.unlinkSync(file.absolutePath);
            }
        })
        callback();
    }
};