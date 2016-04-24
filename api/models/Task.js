/**
* Task.js
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
    starts: {
		type: 'date',
		defaultsTo: new Date()
	},
	ends: {
        type: 'date'
	},
    status: {
        type: 'string',
        required: true,
        defaultsTo: 'new',
        enum: ['new', 'affected', 'on hold', 'done']
    },
    project:{
        model: 'Project'
    },  
    tasklist:{
        model: 'Tasklist'
    }   
       
  }
};

