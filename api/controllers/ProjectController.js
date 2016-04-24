/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var moment = require('moment'),
    async = require('async');
moment.locale('fr');

module.exports = {

    create: function (req, res) {
        console.log('Name :'+req.param('name'));
        Project.create({
            name: req.param('name'),
            projectLeader: req.param('projectLeader').id,
            customer: req.param('customer').id,
            budget: req.param('budget'),
            city: req.param('city'),
            address: req.param('address'),
            starts: req.param('starts'),
            ends: req.param('ends'),
            duration:req.param('duration'),
        }).exec(function (error, project) {
            if (error) {
                console.log(error);
            } else {
                if (req.param('contributors')) {
                    req.param('contributors').forEach(function (contributor, index) {
                        project.contributors.add(contributor.id);
                    });
                }
                if (req.param('participants')) {
                    req.param('participants').forEach(function (participant, index) {
                        project.participants.add(participant.id);
                    });
                }

                SubProject.create({
                    project: project.id,
                    budget: req.param('budget'),
                }).exec(function (err, subproject) {
                    if (err)
                        console.log(err)
                    else {
                        if (req.param('missions')) {
                            req.param('missions').forEach(function (mission, index) {
                                subproject.missions.add(mission.id);
                            });
                        }
                        if (req.param('paymentMethods')) {
                            async.each(req.param('paymentMethods'), function (paymentMethod, callback) {
                                PaymentMethod.create({
                                    percentage: paymentMethod.percentage,
                                    label: paymentMethod.label,
                                    subProject: subproject.id
                                }).exec(function (err, result) {
                                    subproject.paymentMethods.add(result);
                                    callback();
                                });
                            }, function (err) {
                                subproject.save(function (err) {
                                    if (err) {
                                        console.log(err);
                                        res.send(500, {
                                            error: err
                                        });
                                    } else {
                                        subproject.save(function (err) {
                                            if (req.param('documents')) {
                                                async.each(req.param('documents'),function (document, callback) {
                                                    if(!document.id){
                                                        File.create({
                                                            name: document.name,
                                                            nameInDisk: sails.config.appPath + '/.tmp/public/uploads/projects/temp/empty.txt',
                                                            webPath: '/uploads/projects/temp/empty.txt',
                                                            absolutePath: sails.config.appPath + '/.tmp/public/uploads/projects/temp/empty.txt',
                                                            createdBy: req.session.user.id,
                                                            description: document.description
                                                        }).exec(function (err, dataFile) {
                                                            if(err){
                                                                console.log('Error in file creating');
                                                            }
                                                            console.log('New file created '+dataFile.id);
                                                            project.documents.add(dataFile.id);
                                                            callback();


                                                        });
                                                    }else{
                                                        project.documents.add(document.id);
                                                        callback();
                                                    }
                                                },function(err){
                                                    if (err) {
                                                        console.log(err);
                                                        res.send(500, {
                                                            error: err
                                                        });
                                                    }
                                                    project.save(function (err) {
                                                        return res.json(project);
                                                    });
                                                });
                                            }

                                        });
                                    }
                                });
                            });
                        }
                    }
                });

            }
        });

    },

    getAll: function (req, res) {
        Project.find().where({
            'isDeleted': false
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

    getById: function (req, res) {
        Project.find({
            'id': req.param('id')
        }).populateAll().exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                res.json(result[0]);
            }
        });
    },

    remove: function (req, res) {
        Project.update({
            id: req.param('projectID')
        }, {
            'isDeleted': true
        }).exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                res.json(result);
            }
        });
    },

    update: function (req, res) {
        Project.update({
            id: req.param('id'),
        }, {
            name: req.param('name'),
            projectLeader: req.param('projectLeader'),
            city: req.param('city'),
            ends: req.param('ends'),
            starts: req.param('starts'),
            duration: req.param('duration'),
            customer: req.param('customer').id,
            address: req.param('address'),
            participants: req.param('participants'),
            contributors: req.param('contributors')
        }).exec(function (err, project) {
            if (err) {
                console.log(err);
            } else {
                Project.findOne(req.param('id')).populateAll().exec(function (err, result) {
                    if (err) {
                        res.send(500, {
                            error: err
                        });
                    } else {
                        return res.json(result);
                    }
                });
            }
        });
    },

    contractDl: function (req, res) {
        Project.update({
            id: req.param('projectID')
        }, {
            'status': 'Waiting for signing'
        }).exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                res.json(result[0]);
            }
        });
    },
    getStats: function (req, res) {
        Project.find().where({
            'isDeleted': false
        }).populateAll().exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                var stats =[];
                async.each(result,function(project,callback){
                    var totalBilling = 0;
                    var totalPaid = 0;
                    var budget = 0;
                    SubProject.find().where({
                        'project': project.id,
                        'isDeleted': false
                    }).populateAll().exec(function (err, subProjects) {
                        if (err) {
                            console.log(err)
                            res.send(500, {
                                error: err
                            });
                        } else {
                            console.log(subProjects);
                            /*
                             subProjects.forEach(function(subProject,idx,arr){
                                budget += subProject.budget;
                                subProject.bills.forEach(function (bill, i, arr) {
                                    totalBilling += bill.amount;
                                    if (bill.isPaid)
                                        totalPaid += bill.amount;
                                });
                            });
                            stats.push({"id":project.id,
                                "ref":project.ref,
                                "name":project.name,
                                "projectLeader":project.projectLeader,
                                "nbrDocExam": project.docExaminations.length,
                                "nbrVisits" :project.activities.length,
                                "budget":budget,
                                "totalBilling":totalBilling,
                                "totalPaid":totalPaid})*/

                        }
                    });
                },function(err){
                    if(err){
                        console.log("An Error occurred while getting stats");
                    }else{
                        console.log(stats);
                        res.json(stats);
                    }
                });
                //console.log
                /*result.forEach(function(project, index, array){
                    var totalBilling = 0;
                    var totalPaid = 0;
                    var budget = 0;
                    SubProject.find().where({
                        'project': project.id,
                        'isDeleted': false
                    }).populateAll().exec(function (err, result) {
                        if (err) {
                            console.log(err)
                            res.send(500, {
                                error: err
                            });
                        } else {
                            result.forEach(function(subProject,idx,arr){
                                budget += subProject.budget;
                                subProject.bills.forEach(function (bill, i, arr) {
                                    totalBilling += bill.amount;
                                    if (bill.isPaid)
                                        totalPaid += bill.amount;
                                });
                            });
                            stats.push({"id":project.id,
                                        "ref":project.ref,
                                        "name":project.name,
                                        "projectLeader":project.projectLeader,
                                        "nbrDocExam": project.docExaminations.length,
                                        "nbrVisits" :project.activities.length,
                                        "budget":budget,
                            "totalBilling":totalBilling,
                            "totalPaid":totalPaid})

                        }
                    });
                });*/
                //res.json(stats);
            }
        });
    },
}