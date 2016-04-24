/**
 * PlanController
 *
 * @description :: Server-side logic for managing plans
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
module.exports = {

    create: function (req, res) {
        var plan = req.param('plan');
        var attachedFiles = req.param('attachedFiles');
        console.log('Start creating the plan: ' + plan.name);
        Plan.create({
            name: plan.name,
            project: plan.project.id,
            mission: plan.mission.id,
            level: plan.level,
            starts: plan.starts,
            ends: plan.ends,
            editor: plan.editor.id
        }).exec(function (err, plan) {
            if (err) {
                res.json(500, {
                    error: err
                });
            } else {
                // TODO Create files if not already created
                async.each(attachedFiles, function (file, callback) {
                    if (file.size) {
                        //  update the file
                        console.log('Updating the file: '+file.name);
                        file.planAttachedFile = plan.id;
                        // TODO move the file  from temp to attached file directory
                        File.update({'id': file.id}, file).exec(function (err, datafile) {
                            if (err){
                                return res.json(500, {error: err});
                            } else{
                                plan.attachedFiles.add(datafile.id);
                            }
                            callback();
                        });
                    } else {
                        // Create the file
                        console.log('Adding new file: '+file.name);
                        file.webPath = '/uploads/plans/temp/' + plan.project.id + '/' + file.name;
                        file.nameInDisk = file.name;
                        file.planAttachedFile = plan.id;
                        file.size = 0;
                        File.create(file).exec(function (err, dataFile) {
                            if (err) {
                                console.log(err);
                            } else {

                                plan.attachedFiles.add(dataFile.id);
                                console.log(plan.attachedFiles);

                            }

                        });
                        callback();
                    }
                }, function () {
                    console.log('Enter plan.save');
                    plan.save(function (err) {
                        if (err) {
                            return res.json(500, {
                                error: err
                            });
                        }
                        console.log('update the plan after adding files');
                        return res.json(plan);

                    });
                });

            }
        });
    },
    getAll: function (req, res) {
        Plan.find().where({
            'deleted': false
        }).populateAll().exec(function (err, result) {
            if (err) {
                res.json(500, {
                    error: err
                });
            } else {
                res.json(result);
            }

        });
    },
    getByProject: function (req, res) {
        var project = req.param('project');
        if (!project) {
            res.json(500, {
                error: "L'identifiant du projet est indéfini"
            });
            return;
        }

        Plan.find().where({
            'project': project,
            'deleted': false
        }).populateAll().exec(function (err, result) {
            if (err) {
                res.json(500, {
                    error: err
                });
            } else {
                res.json(result);
            }

        });
    },
    getById: function (req, res) {
        var id = req.param('id');
        if (!id) {
            res.json(500, {
                error: "L'identifiant du plan est indéfini"
            });
            return;
        }
        Plan.find().where({
            'id': id,
            'deleted': false
        }).populateAll().exec(function (err, result) {
            if (err) {
                res.json(500, {
                    error: err
                });
            } else {
                res.json(result);
            }

        });
    },
    update: function (req, res) {

        Plan.update({
            'id': req.param('id')
        }, {
            name: req.param('name'),
            project: req.param('project'),
            subproject: req.param('subproject'),
            level: req.param('level'),
            starts: req.param('starts'),
            ends: req.param('ends'),
            editor: req.param('editor'),
            status: req.param('status'),


        }).exec(function (err, result) {
            if (err)
                res.json(500, {
                    error: err
                });
            else
                res.json(result);
        });
    },
    remove: function (req, res) {
        var id = req.param('id');
        if (!id) {
            res.json(500, {
                error: "L'identifiant du plan est indéfini"
            });
            return;
        }
        Plan.update({
            'id': id
        }, {
            deleted: true

        }).exec(function (err, result) {
            if (err)
                res.json(500, {
                    error: err
                });
            else {
                console.log("The plan #ID : " + req.param('id') + " Deleted successfully!!");
                res.json(result);
            }
        });
    },
    destroy: function (req, res) {
        Plan.destroy({
            id: req.param('id')
        }).exec(function (err) {
            if (err)
                res.json(500, {
                    error: err
                });
            else
                res.json({
                    msg: 'Plan supprimé avec succès.'
                })
        });
    }

};