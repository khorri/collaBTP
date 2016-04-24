/**
 * VersionPlan.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    schema: true,
    attributes: {
        plan:{
            model :'Plan'
        },
        versionNumber: {
            type: 'string',
            defaultsTo: '1.0'
        },
        file:{
            model: 'File'
        },
        rootFile:{
            model: 'File'
        },
        dwgFile:{
            model: 'File'
        },
        reason:{
            type:'string'
        },
        observation:{
            type: 'string'
        },
        editor:{
            model:'User'
        },
        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        },
        afterDestroy: function (destroyedRecords, callback) {
            destroyedRecords.forEach(function (version, index) {
                if(fs.existsSync(version.rootFile.absolutePath)) {
                    fs.unlinkSync(version.rootFile.absolutePath);
                }
            })
            callback();
        }

    }
};

