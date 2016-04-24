/**
 * DescriptionFileController
 *
 * @description :: Server-side logic for managing Descriptionfiles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    create: function (req, res) {
        DescriptionFile.create({
            name: req.param('name'),
            version: req.param('version'),
            project: req.param('project'),
            createdBy: req.param('createdBy'),
            riskEvaluation: req.param('riskEvaluation'),
            observations: req.param('observations'),
            workExamination: req.param('workExamination'),
            surveyExamination: req.param('surveyExamination'),
            date: req.param('date'),
            planNumber: req.param('planNumber'),
            geotechnicalInvestigation: req.param('geotechnicalInvestigation'),
            soilStress: req.param('soilStress'),
            fundationMode: req.param('fundationMode'),
            couche: req.param('couche'),
            nappePresence: req.param('nappePresence'),
            habitationType: req.param('habitationType'),
            permanentLoad: req.param('permanentLoad'),
            exploitationLoad: req.param('exploitationLoad'),
            levelsNumber: req.param('levelsNumber'),
            interstageMaxHeight: req.param('interstageMaxHeight'),
            buildingHeight: req.param('buildingHeight'),
            poutreMaxRange: req.param('poutreMaxRange'),
            consoleMaxRange: req.param('consoleMaxRange'),
            pafMaxRange: req.param('pafMaxRange'),
            panelType: req.param('panelType'),
            concentratedLoads: req.param('concentratedLoads'),
            percentage: req.param('percentage'),
            site: req.param('site'),
            behaviorCoeff: req.param('behaviorCoeff'),
            dynamicCoeff: req.param('dynamicCoeff'),
            bracingType: req.param('bracingType'),
            buildingClass: req.param('buildingClass'),
        }).exec(function (error, descFile) {
            if (error) {
                console.log(error);
            } else {
                req.param('participants').forEach(function (participant, index) {
                    descFile.participants.add(participant);
                })
                descFile.save();
                DescriptionFile.findOne({
                    'id': descFile.id
                }).populateAll().exec(function (err, result) {
                    if (err) {
                        res.send(500, {
                            error: err
                        });
                    } else {
                        var outputname = 'descFile_' + result.id;
                        var geotec = 'Non'
                        var nappe = 'Non'
                        var concentratedLoads = 'Non'
                        if (result.geotechnicalInvestigation) {
                            geotec = 'Oui';
                        }
                        if (result.nappePresence) {
                            nappe = 'Oui';
                        }
                        if (result.concentratedLoads) {
                            concentratedLoads = 'Oui';
                        }
                        DocGenService.generateDoc({
                            "projectId": result.project.id,
                            "projectName": result.project.name,
                            "projectLeader": result.project.projectLeader.name,
                            "projectAddress": result.project.address,
                            "riskEvaluation": result.riskEvaluation,
                            "workExamination": result.workExamination,
                            "surveyExamination": result.surveyExamination,
                            "geotechnicalInvestigation": geotec,
                            "soilStress": result.soilStress,
                            "fundationMode": result.fundationMode,
                            "couche": result.couche,
                            "nappePresence": nappe,
                            "habitationType": result.habitationType,
                            "permanentLoad": result.permanentLoad,
                            "exploitationLoad": result.exploitationLoad,
                            "levelsNumber": result.levelsNumber,
                            "interstageMaxHeight": result.interstageMaxHeight,
                            "buildingHeight": result.buildingHeight,
                            "poutreMaxRange": result.poutreMaxRange,
                            "consoleMaxRange": result.consoleMaxRange,
                            "pafMaxRange": result.pafMaxRange,
                            "panelType": result.panelType,
                            "concentratedLoads": concentratedLoads,
                            "percentage": result.percentage,
                            "site": result.site,
                            "behaviorCoeff": result.behaviorCoeff,
                            "dynamicCoeff": result.dynamicCoeff,
                            "bracingType": result.bracingType,
                            "buildingClass": result.buildingClass,
                            "observations": result.observations
                        }, 'DescriptionFileTemplateDoc.docx', outputname, function (file) {
                            DescriptionFile.update({
                                id: result.id
                            }, {
                                file: file.id
                            }).exec(function (err, updated) {
                                if (err)
                                    console.log(err);
                                res.json(result);
                            })
                        })
                    }
                });

            }
        });
    },

    getById: function (req, res) {
        DescriptionFile.findOne({
            'id': req.param('id')
        }).populateAll().exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                res.json(result);
            }
        });
    },

    getLastVersion: function (req, res) {
        DescriptionFile.findOne({
            where: {
                'project': req.param('id')
            },
            limit: 1,
            sort: 'version DESC'
        }).populateAll().exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                res.json(result);
            }
        });
    },

    getAllByProject: function (req, res) {
        DescriptionFile.find({
            'project': req.param('id')
        }).populateAll().exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                res.json(result);
            }
        });
    },

};