/**
* StatisticByProject.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      ref: {
          type: 'string'
      },
      name: {
          type: 'string'
      },
      projectLeader: {
          model: 'User'
      },
      docExamCount:{
          type:'integer'
      },
      fieldVisitCount:{
          type:'integer'
      },
      totalBilled:{
          type:'float'
      },
      totalNotBilled:{
          type:'float'
      },
      totalPaid:{
          type:'float'
      },
      totalNotPaid:{
          type:'float'
      }
  }
};

