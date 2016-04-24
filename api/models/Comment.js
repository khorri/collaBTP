/**
* Comment.jsz
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
        content : {
            type : 'text'
        },
        subject : {
            type : 'text'
        },
        sender :{
            model : 'User'
        },
        recipient : {
            type : 'text'
        },
        from :{
            model : 'User'
        },
      attachment :{
          collection : 'File',
          via : 'attachmentsComment'
      },
      isDeleted : {
          type: 'boolean',
          defaultsTo : 'false'
      },
      project :{
          model : 'Project'
      }
  }
};

