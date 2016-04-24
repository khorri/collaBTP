/**
 * Activity.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var moment = require('moment');
module.exports = {
    schema: true,
    attributes: {
        title: {
            type: 'string',
            required: true
        },
        status: {
            type: 'string',
            required: true,
            defaultsTo: 'new'
        },
        description: {
            type: 'string'
        },
        date: {
            type: 'date',
            defaultsTo: new Date()
        },
        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        },
        project: {
            model: 'Project',
            required: true
        },
        contributor: {
            model: 'User'
        },
        attachedFiles: {
            collection: 'File',
            via: 'activity'
        },
        fiche: {
            model: 'File'
        },
        ref: {
            type: 'string'
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

        min = min + "";

        if (min.length == 1) {
            min = "0" + min;
        }
        values.ref = "VC" + year + month + day + hour + min;
        next();
    }
};