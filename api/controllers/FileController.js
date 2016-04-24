/**
 * FileController
 *
 * @description :: Server-side logic for managing Files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
    'use strict'
var async = require('async');
var mkdirp = require('mkdirp');
var _ = require('lodash');
module.exports = {
    upload: function (req, res) {
        req.file('docs').upload({
            dirname: sails.config.appPath + '/.tmp/public/uploads'
        }, function (err, files) {
            if (err) return res.send(500, err);
            files.forEach(function (file, index) {
                var sFilename = file.fd.split('/');
                var sType = file.type.split('/'); //TODO file upload
                File.create({
                    name: file.filename,
                    size: file.size,
                    path: /uploads/ + sFilename[sFilename.length - 1],
                    fd: file.fd
                }).exec(function (err, file) {
                    if (err)
                        console.log(err)
                });
            })
            return res.json({
                message: files.length + ' file(s) uploaded successfully!',
                files: files
            });
        });
    },

    uploadSignedContract: function (req, res) {
        req.file('doc').upload({
            dirname: sails.config.appPath + '/.tmp/public/uploads'
        }, function (err, files) {
            if (err) return res.send(500, err);
            var file = files[0];
            var sFilename = file.fd.split('/');
            var sType = file.type.split('/');
            File.create({
                name: file.filename,
                nameInDisk: sFilename[sFilename.length - 1],
                size: file.size,
                webPath: /uploads/ + sFilename[sFilename.length - 1],
                absolutePath: file.fd,
                ext: 'pdf'
            }).exec(function (err, file) {
                if (err)
                    console.log(err)
                SubProject.update({
                    id: req.param('id')
                }, {
                    signedContract: file.id,
                    status: 'Contract signed'
                }).exec(function (err, project) {
                    return res.json(file);
                })
            });
        });
    },

    uploadFieldVisitFiles: function (req, res) {
        var id = req.param('id');
        mkdirp(sails.config.appPath + '/.tmp/public/uploads/fieldVisits/' + id, function (err) {
            if (err) console.error(err)
            else {
                req.file('files').upload({
                    dirname: sails.config.appPath + '/.tmp/public/uploads/fieldVisits/' + id
                }, function (err, files) {
                    if (err) return res.send(500, err);
                    Activity.findOne({id: req.param('id')}).populateAll().exec(function (err, activity) {
                        async.each(files, function (file, callback) {
                            var sFilename = file.fd.split('/');
                            var sType = file.type.split('/');
                            File.create({
                                name: file.filename,
                                nameInDisk: sFilename[sFilename.length - 1],
                                size: file.size,
                                webPath: '/uploads/fieldVisits/' + id + '/' + sFilename[sFilename.length - 1],
                                absolutePath: file.fd,
                                type: file.type,
                                createdBy: req.session.user.id
                            }).exec(function (err, result) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    activity.attachedFiles.add(result);
                                    callback();
                                }
                            });
                        }, function (err) {
                            if (err)
                                console.log(err);
                            activity.save(function (err) {
                                File.find({
                                    where: {activity: req.param('id')},
                                    sort: 'createdAt DESC'
                                }).populateAll().exec(function (err, files) {
                                    return res.json(files);
                                })
                            })
                        });
                    });
                });
            }
        });

    },

    generatePdf: function (req, res) {
        var s = sails;
        var data = {
            "subProjectId": req.param('subProjectId'),
            "projectRef": req.param('projectRef'),
            "subProjectDate": req.param('subProjectDate'),
            "ourCompany": req.param('ourCompany'),
            "ourCompanyAddress": req.param('ourCompanyAddress'),
            "projectName": req.param('projectName'),
            "projectLeader": req.param('projectLeader'),
            "projectAddress": req.param('projectAddress'),
            "customer": req.param('customer'),
            "customerType": req.param('customerType'),
            "customerAddress": req.param('customerAddress'),
            "missionGO": req.param('missionGO'),
            "missionPELEC": req.param('missionPELEC'),
            "missionETANCH": req.param('missionETANCH'),
            "goOrPLMB": req.param('goOrPLMB'),
            "budget": req.param('budget'),
            "city": req.param('city'),
            "paymentMethods": req.param('paymentMethods'),
            "projectDuration": req.param('projectDuration')
        };
        pdfGeneratorService.generateContrat(data,
            "contractTemplate.html", req.param('projectRef'), "contract_" + req.param('subProjectId'),
            function (file) {
                File.findOrCreate({
                    name: "contract_" + req.param('subProjectId')
                }, {
                    name: "contract_" + req.param('subProjectId'),
                    nameInDisk: "contract_" + req.param('subProjectId'),
                    webPath: "/documents/contract_" + req.param('subProjectId') + ".pdf",
                    absolutePath: sails.config.appPath + '/.tmp/public/documents/contract_' + req.param('subProjectId'),
                    ext: 'pdf',
                    type: 'document',
                    subProject: req.param('subProjectId')
                }).exec(function (err, file) {
                    if (err)
                        console.log(err)
                    SubProject.update({
                        id: req.param('subProjectId')
                    }, {
                        contract: file.id,
                        isContratGen: true
                    }).exec(function (err, project) {
                        return res.json(file);
                    })

                });
            });
    },

    generateInvoice: function (req, res) {
        pdfGeneratorService.generate({
                "factureRef": req.param('factureRef'),
                "factureDate": req.param('factureDate'),
                "customerCompany": req.param('customerCompany'),
                "customerAddress": req.param('customerAddress'),
                "pms": req.param('pms'),
                "amountHT": req.param('amountHT'),
                "taxe": req.param('taxe'),
                "projectName": req.param('projectName'),
                "projectRef": req.param('projectRef'),
                "amountTTC": req.param('amountTTC'),
                "amountInWords": req.param('amountInWords')
            },
            "invoiceTemplate.html", "facture_" + req.param('factureRef'),
            function (file) {
                File.findOrCreate({
                    name: "facture_" + req.param('factureRef')
                }, {
                    name: "facture_" + req.param('factureRef'),
                    nameInDisk: "facture_" + req.param('facture_') + ".pdf",
                    webPath: "/documents/facture_" + req.param('factureRef') + ".pdf",
                    absolutePath: sails.config.appPath + '/.tmp/public/documents/facture_' + req.param('factureRef') + ".pdf",
                    ext: 'pdf',
                    type: 'document',
                    bill: req.param('billId')
                }).exec(function (err, file) {
                    if (err)
                        console.log(err)
                    Bill.update({
                        id: req.param('billId')
                    }, {
                        invoice: file.id
                    }).exec(function (err, bill) {
                        return res.json(file);
                    })

                });
            })
    },

    testGeneratePdf: function (req, res) {
        pdfGeneratorService.generate({
                "test": 'test'
            },
            "examenDocTemplate.html", 'output',
            function (file) {
                File.findOrCreate({
                    name: "output"
                }, {
                    name: "output",
                    nameInDisk: "output",
                    webPath: "/documents/output.pdf",
                    absolutePath: sails.config.appPath + '/.tmp/public/documents/output.pdf',
                    ext: 'pdf',
                    type: 'document'
                }).exec(function (err, file) {
                    if (err)
                        console.log(err)
                    return res.json(file);
                });
            });
    },

    uploadAvatar: function (req, res) {
        req.file('file').upload({
            dirname: sails.config.appPath + '/.tmp/public/uploads'
        }, function (err, files) {
            if (err) return res.send(500, err);
            var file = files[0];
            var sFilename = file.fd.split('/');
            var sType = file.type.split('/');
            File.create({
                name: file.filename,
                nameInDisk: sFilename[sFilename.length - 1],
                size: file.size,
                webPath: /uploads/ + sFilename[sFilename.length - 1],
                absolutePath: file.fd
            }).exec(function (err, file) {
                if (err)
                    console.log(err)

            });
            return res.json({
                message: files.length + ' file(s) uploaded successfully!',
                files: files
            });
        });
    },

    generateExamDoc: function (req, res) {
        pdfGeneratorService.generate({
                "ourCompany": req.param('ourCompany'),
                "ourCompanyAddress": req.param('ourCompanyAddress'),
                "projectName": req.param('projectName'),
                "projectLeader": req.param('projectLeader'),
                "projectAddress": req.param('projectAddress'),
                "projectRef": req.param('projectRef'),
                "customer": req.param('customer'),
                "city": req.param('city'),
                "participants": req.param('participants'),
                "contributor": req.param('examDocs')[0].contributor,
                "examDocs": req.param('examDocs'),
                "mailNum": req.param('examDocs')[0].mailNum,
                "missions": req.param('missions')
            },
            "examenDocTemplate.html", "ExamDoc_" + req.param('projectRef'),
            function (file) {
                File.findOrCreate({
                    name: "ExamDoc_" + req.param('projectRef') + ".pdf"
                }, {
                    name: "ExamDoc_" + req.param('projectRef') + ".pdf",
                    nameInDisk: "ExamDoc_" + req.param('projectRef'),
                    webPath: "/documents/ExamDoc_" + req.param('projectRef') + ".pdf",
                    absolutePath: sails.config.appPath + '/.tmp/public/documents/ExamDoc_' + req.param('projectRef') + ".pdf",
                    ext: 'pdf',
                    type: 'document'
                }).exec(function (err, file) {
                    if (err)
                        console.log(err)
                    return res.json(file);
                });
            }, req.param('header'))
    },

    remove: function (req, res) {
        File.destroy({
            id: req.param('fileId')
        }).exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                File.find({
                    'activity': req.param('activityId')
                }).populateAll().exec(function (err, result) {
                    if (err) {
                        res.send(500, {
                            error: err
                        });
                    } else {
                        res.json(result);
                    }
                });
            }
        });
    },
    uploadMessageAttachments: function (req, res) {
        var id = req.param('projectId');
        var dirName = sails.config.appPath + '/.tmp/public/uploads/attachments/' + id
        mkdirp(dirName, function (err) {
            if (err)
                return res.json({
                    error: err,
                    info: 'An error occurred while creating (attachment) directory!!'
                });
            req.file('files').upload({
                dirname: dirName
            }, function (err, files) {
                if (err) return res.send(500, err);
                var arrFiles = [];
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var sFilename = file.fd.split('/');
                    var sType = file.type.split('/');
                    arrFiles.push({
                        name: file.filename,
                        nameInDisk: sFilename[sFilename.length - 1],
                        size: file.size,
                        webPath: '/uploads/attachments/' + id + '/' + sFilename[sFilename.length - 1],
                        absolutePath: file.fd,
                        type: file.type,
                        createdBy: req.session.user.id
                    })
                }
                File.create(arrFiles).exec(function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        return res.json(data);
                    }

                });
            });

        });

    },

    /* Upload the company logo*/
    uploadLogo: function (req, res) {
        var id = req.param('settingId');
        req.file('files').upload({
            dirname: sails.config.appPath + '/.tmp/public/uploads/'
        }, function (err, files) {
            if (err) return res.send(500, err);
            var file = files[0];
            var sFilename = file.fd.split('/');
            var sType = file.type.split('/');
            File.create({
                name: file.filename,
                nameInDisk: sFilename[sFilename.length - 1],
                size: file.size,
                webPath: '/uploads/' + sFilename[sFilename.length - 1],
                absolutePath: file.fd
            }).exec(function (err, data) {
                console.log(data);

                if (err) {
                    console.log(err);
                    return res.send(500, err);
                }
                Settings.update({
                    id: id
                }, {
                    logo: data.id
                }).exec(function (err, Settings) {
                    return res.json({
                        message: data.name + ' file uploaded successfully!',
                        file: data
                    });
                });

            });
        });
    },


    uploadDocument: function (req, res) {

        var dirName = sails.config.appPath + '/.tmp/public/uploads/projects/temp/'
        if(!req.session.user){
            return res.json(500, {
                error: err,
                info: 'la session est expiré, merci de recharger la page'
            });
        }
        mkdirp(dirName, function (err) {
            if (err) {
                console.error(err);
                return res.json(500, {
                    error: err,
                    info: 'An error occurred while creating plans (attachment) directory!!'
                });
            }
            req.file('doc').upload({
                dirname: dirName
            }, function (err, files) {
                var file = files[0];
                var sFilename = file.fd.split('/');
                var sType = file.type.split('/');
                if (err) {
                    console.error(err);
                    return res.send(500, {
                        error:  err,
                        message: 'Impossible de charger le document: '+file.filename
                    });
                }

                File.create({
                    name: file.filename,
                    nameInDisk: sFilename[sFilename.length - 1],
                    size: file.size,
                    webPath: '/uploads/projects/temp/' + sFilename[sFilename.length - 1],
                    absolutePath: file.fd,
                    type: file.type,
                    createdBy: req.session.user.id
                }).exec(function (err, dataFile) {
                    if (err) {
                        console.error(err);
                        return res.json(500, {
                            error: err
                        });
                    } else {
                        //create or update a version
                        FileVersion.create({
                            file: dataFile.id,
                            rootFile: dataFile.id,
                            reason: dataFile.description,
                            editor: req.session.user.id
                        }).exec(function (err, result) {
                            if (err) {

                                console.error(err);
                                return res.json(500, {
                                    code: 'ERR_VERS_CREATION',
                                    error: "Erreur lors de la création du fichier!"
                                });

                            }

                            dataFile.versions.add(result);
                            dataFile.lastVersion = result.versionNumber;
                            dataFile.save(function (err) {
                                if (err) {
                                    console.error(err);
                                    return res.json(500, {
                                        code: 'ERR_VERS_POST_CREATION',
                                        error: "Erreur lors de la création du fichier!"
                                    });
                                }
                                return res.json(dataFile);
                            });
                        });
                    }

                });
            });
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

        File.find().where({
            'project': project,
            'isDeleted': false
        }).populateAll().exec(function (err, result) {
            if (err) {
                console.error(err);
                res.json(500, {
                    error: err
                });
            } else {
                res.json(result);
            }

        });
    },
    create: function (req, res) {
        var file = req.params.all();
        if (!file) {
            return res.json(500, {
                error: "Fichier vide"
            });

        }
        if(!req.session.user){
            return res.json(500, {
                error: err,
                info: 'la session est expiré, merci de recharger la page.'
            });
        }
        if (file.id) {
            File.update({
                id: file.id
            }, {
                title: file.title,
                description: file.description,
                project: file.project.id
            }).exec(function (err, dataFile) {
                if (err) {
                    console.error(err);
                    return res.json(500, {
                        error: "Erreur lors de la création du fichier!"
                    });
                } else {
                    return res.json(dataFile);
                }
            });
        } else {
            File.create({
                name: file.title,
                title: file.title,
                nameInDisk: sails.config.appPath + '/.tmp/public/uploads/projects/temp/empty.txt',
                webPath: '/uploads/projects/temp/empty.txt',
                absolutePath: sails.config.appPath + '/.tmp/public/uploads/projects/temp/empty.txt',
                createdBy: req.session.user.id,
                description: file.description,
                project: file.project.id
            }).exec(function (err, dataFile) {
                if (err) {
                    console.error(err);
                    return res.json(500, {
                        error: "Erreur lors de la création du fichier!"
                    });
                }
                console.log("DataFile: "+dataFile)
                //create or update a version
               /* FileVersion.create({
                    file: dataFile.id,
                    reason: dataFile.description,
                    editor: req.session.user.id
                }).exec(function (err, result) {
                    if (err) {

                        console.error(err);
                        return res.json(500, {
                            code: 'ERR_VERS_CREATION',
                            error: "Erreur lors de la création du fichier!"
                        });

                    }
                    console.log("======>"+result);
                    dataFile.versions.add(result);
                    dataFile.lastVersion = result.versionNumber;
                    dataFile.save(function (err) {
                        if (err) {
                            console.error(err);
                            return res.json(500, {
                                code: 'ERR_VERS_POST_CREATION',
                                error: "Erreur lors de la création du fichier!"
                            });
                        }
                        return res.json(dataFile);
                    });
                });*/
                return res.json(dataFile);

            });
        }
    },
    removeDocument: function (req, res) {
        File.find().where({id: req.param('fileId')}).populateAll().exec(function(err,file){
            if (err) {
                console.error(err);
                return res.json(500, {
                    code: 'ERR_REMOVE_FILE',
                    error: "Erreur lors de la suppression du fichier!"
                });
            }
            _(file.versions).forEach(function(v){
                    FileVersion.destroy().exec(function(err,result){
                        if (err) {
                            console.error(err);
                            return res.json(500, {
                                code: 'ERR_REMOVE_FILE_VERSION',
                                error: "Erreur lors de la suppression du fichier!"
                            });
                        }
                    });
            });
            File.destroy({
                id: req.param('fileId')
            }).exec(function (err, result) {
                if (err) {
                    console.error(err);
                    return res.json(500, {
                        code: 'ERR_REMOVE_FILE',
                        error: "Erreur lors de la suppression du fichier!"
                    });
                } else {
                    return res.json('Fichier supprimé avec succès');
                }
            });
        });

    },
    update:function(req,res){
        File.update(
            {id:req.param('id')},
            {
              title: req.param('title'),
              description: req.param('description')
            }).exec(function(err, data){
                if (err) {
                    console.error(err);
                    return res.json(500, {
                        code: 'ERR_UPDATE_FILE',
                        error: "Erreur lors de la modification du fichier: "+ req.param('title')
                    });
                }
                return res.json(data);
            });
    },



};