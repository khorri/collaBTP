/**
 * DescriptionFile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        version: {
            type: 'integer',
            required: true,
        },
        participants: {
            collection: 'Participant',
        },
        project: {
            model: 'Project',
        },
        createdBy: {
            model: 'User'
        },
        riskEvaluation: {
            type: 'string'
        },
        observations: {
            type: 'string'
        },
        workExamination: {
            type: 'string'
        },
        surveyExamination: {
            type: 'string'
        },
        date: {
            type: 'date'
        },
        planNumber: {
            type: 'string'
        },
        /* Sol */
        geotechnicalInvestigation: {
            type: 'boolean'
        },
        soilStress: {
            type: 'float'
        },
        fundationMode: {
            type: 'string'
        },
        couche: {
            type: 'string'
        },
        nappePresence: {
            type: 'boolean'
        },

        /* Type de bâtiment */
        habitationType: {
            type: 'string'
        },
        permanentLoad: {
            type: 'float'
        },
        exploitationLoad: {
            type: 'float'
        },
        levelsNumber: {
            type: 'integer'
        },
        interstageMaxHeight: {
            type: 'float'
        },
        buildingHeight: {
            type: 'float'
        },

        /* Structure */

        poutreMaxRange: {
            type: 'float'
        },
        consoleMaxRange: {
            type: 'float'
        },
        pafMaxRange: {
            type: 'float'
        },
        panelType: {
            type: 'string'
        },
        concentratedLoads: {
            type: 'boolean'
        },
        percentage: {
            type: 'float'
        },

        /* Sismique */

        site: {
            type: 'string'
        },
        behaviorCoeff: {
            type: 'float'
        },
        dynamicCoeff: {
            type: 'float'
        },
        bracingType: {
            type: 'string'
        },
        buildingClass: {
            type: 'string'
        },

        file: {
            model: 'File'
        },

    }
};