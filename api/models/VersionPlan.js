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
          versionDate: {
              type: 'date',
              defaultsTo: new Date()
          },
          versionNumber: {
              type: 'float',
              defaultsTo: 1.0
          },
          pdfFile:{
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
          }
          
      }
};

