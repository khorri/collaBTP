/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: true,
  attributes: {
    content: {
      type: 'text',
      required: true
    },
    from: {
      model: 'User',
      required: true
    },
	to: {
      model: 'User',
      required: true
    },  
    new: {
      type: 'boolean',
      defaultsTo: true
    },
  }
};

