/**
 * ActivityController
 *
 * @description :: Server-side logic for managing Activities
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var moment = require('moment')
var fs = require('fs');
module.exports = {
    create: function (req, res) {
        Activity.create({
            title: req.param('title'),
            status: req.param('status'),
            description: req.param('description'),
            date: req.param('date'),
            project: req.param('project'),
            contributor: req.param('contributor')
        }).exec(function (error, activity) {
            if (error) {
                console.log(error);
            } else {
                return res.json(activity);
            }
        });
    },

    getAll: function (req, res) {
        Activity.find().where({
            'isDeleted': false
        }).populateAll().exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                var rs = result.filter(function(obj){
                    return obj.project.isDeleted === false;
                });
                res.json(rs);
            }
        });
    },

    getAllByProject: function (req, res) {
        Activity.find().where({
            'isDeleted': false,
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


    getById: function (req, res) {
        Activity.findOne({
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

    update: function (req, res) {
        Activity.update({
            id: req.param('id')
        }, {
            title: req.param('title'),
            status: req.param('status'),
            description: req.param('description'),
            date: req.param('date'),
            contributor: req.param('contributor')
        }).exec(function (err, activity) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                return res.json(activity);
            }
        });
    },

    getAttachedFiles: function (req, res) {
        File.find({
            where: {activity: req.param('id')},
            sort: 'createdAt DESC'
        }).populateAll().exec(function (err, attachedFiles) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                return res.json(attachedFiles);
            }
        });
    },

    remove: function (req, res) {
        Activity.update({
            id: req.param('id')
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

    generateFVDoc: function (req, res) {
        var templateName = "";
        if (req.param('title') == "CONTRÔLE DE L'ETANCHIETE DES TERRASSES") {
            templateName = "etanchFVTempl.html";
        } else if (req.param('title') == "CONTRÔLE DES FONDATIONS") {
            templateName = "fondationFVTempl.html";
        } else if (req.param('title') == "CONTRÔLE DES LONGRINES") {
            templateName = "longrineFVTempl.html";
        } else if (req.param('title') == "CONTRÔLE DES PLANCHERS") {
            templateName = "plancherFVTempl.html";
        } else if (req.param('title') == "CONTRÔLE DES GROS ŒUVRES") {
            templateName = "grosoeuvreFVTempl.html";
        } else if (req.param('title') == "CONTRÔLE DES RADIERS") {
            templateName = "radierFVTempl.html";
        } else if (req.param('title') == "CONTRÔLE DES POTEAUX") {
            templateName = "poteauxFVTempl.html";
        }

        pdfGeneratorService.generateWithoutMargin({
                "projectName": req.param('projectName'),
                "projectAddress": req.param('projectAddress'),
                "projectRef": req.param('projectRef'),
                "projectLeader": req.param('projectLeader'),
                "participants": req.param('participants'),
                "activityId": req.param('activityId'),
                "activityRef": req.param('activityRef'),
                "description": req.param('description'),
                "activityDate": moment(req.param('activityDate')).format("DD/MM/YYYY"),
                "contributor": req.param('contributor')
            },
            templateName, "visiteChantier_" + req.param('activityId'),
            function (file) {
                File.findOrCreate({
                    name: "visiteChantier_" + req.param('activityId')
                }, {
                    name: "visiteChantier_" + req.param('activityId'),
                    nameInDisk: "visiteChantier_" + req.param('activityId'),
                    webPath: "/documents/visiteChantier_" + req.param('activityId') + ".pdf",
                    absolutePath: sails.config.appPath + '/.tmp/public/documents/visiteChantier_' + req.param('activityId') + ".pdf",
                    ext: 'pdf',
                    type: 'document',
                    createdBy: req.session.user.id,
                    activity: req.param('activityId')
                }).exec(function (err, file) {
                    if (err) {
                        console.log(err)
                    } else {
                        Activity.update({
                            id: req.param('activityId')
                        }, {
                            fiche: file.id
                        }).exec(function (err, activity) {
                            return res.json(file);
                        })
                    }
                });
            })
    },
    genarateZipArchive : function(req, res){
        var source = sails.config.appPath+'/.tmp/public/uploads/fieldVisits/'+req.param('id');
        var destination = sails.config.appPath+'/.tmp/public/uploads/fieldVisits/'+req.param('id')+'.zip';
        ZipGeneratorService.generate(source,destination,function(file){
            var stat = fs.statSync(destination);
            res.writeHead(200, {
                'Content-Type': 'application/zip',
                'Content-Length': stat.size,
                'Content-disposition': 'attachment; filename=' + req.param('id')+'.zip'
            });

            var readStream = fs.createReadStream(destination);
            // We replaced all the event handlers with a simple call to readStream.pipe()
            readStream.pipe(res);
        });
    },
    sendEmail: function (req, res) {
        console.log(req.param('html'));
        emailService.sendEmail(req.param('from'), req.param('to'), req.param('subject'), req.param('text'), req.param('html'), req.param('attachments'), function (err, info) {
            if (err) {
                console.log(err)
                return res.json({
                    error: err,
                    info: info
                })
            } else {
                return res.json({
                    info: info
                })
            }
        })
    }
};