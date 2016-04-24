/**
 * FileVersionController
 *
 * @description :: Server-side logic for managing Fileversions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    create: function (req, res) {
        var rootFile = req.param('rootFile');
        var project = req.param('project');
        var newFile = req.param('newFile');
        File.findOne().where({
            id:newFile.id
        }).populateAll().exec(function(err, file){
            if (err) {

                console.error(err);
                return res.json(500, {
                    code: 'ERR_VERS_CREATION',
                    error: "Erreur lors de la création d'un version du fichier!"
                });

            }

                FileVersion.update({
                    id:file.versions[0].id
                },{
                    versionNumber :req.param('version'),
                    reason:req.param('comment')
                }).exec(function(err,version){
                    if (err) {

                        console.error(err);
                        return res.json(500, {
                            code: 'ERR_VERS_CREATION',
                            error: "Erreur lors de la création d'un version du fichier!"
                        });

                    }
                    file.lastVersion= req.param('version');
                    file.project = project.id;
                    file.description = req.param('comment');
                    file.title = rootFile.title;
                    if (rootFile.versions) {
                        rootFile.versions.forEach(function (version, index) {
                            file.versions.add(version);
                        });
                    }
                    // copy the new File to project directory
                    file.save(function (err) {
                        if (err) {
                            console.error(err);
                            return res.json(500, {
                                code: 'ERR_VERS_CREATION',
                                error: "Erreur lors de la création d'un version du fichier!"
                            });
                        }else{
                            File.update({id:rootFile.id},{project:null}).exec(function(err,dataFile){
                                if (err) {
                                    console.error(err);
                                    return res.json(500, {
                                        code: 'ERR_VERS_CREATION',
                                        error: "Erreur lors de la création d'un version du fichier!"
                                    });
                                }
                                return res.json(file);
                            });

                        }

                    });

                });





        });


    },
    getVersions : function(req,res){
        var ids = req.param('ids');
        console.log(ids);
        FileVersion.find().where({
            id:ids,
            isDeleted:false
        }).populateAll().sort('createdAt ASC').exec(function(err,result){
            if (err) {
                console.error(err);
                return res.json(500, {
                    code: 'ERR_VERS_CREATION',
                    error: "Erreur lors de la création d'un version du fichier!"
                });
            }
            return res.json(result);
        });
    },
    remove: function(req,res){
        FileVersion.destroy({
            id: req.param('id')
        }).exec(function (err, result) {
            if (err) {
                console.error(err);
                return res.json(500, {
                    code: 'ERR_REMOVE_FILE_VERSION',
                    error: "Erreur lors de la suppression du fichier!"
                });
            } else {
                res.json(result);
            }
        });
    },
    downloadVersion: function (req, res) {
        FileVersion.find({
            id: req.param('id')
        }).populateAll().exec(function(err,version){
            if (err) {
                console.error(err);
                return res.json(500, {
                    code: 'ERR_DOWNLOAD_FILE_VERSION',
                    error: "Erreur lors de la téléchargerment du fichier!"
                });
            }
            var location = version[0].rootFile.nameInDisk;
            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk(/* optional opts */);
            fileAdapter.read(location).on('error', function (err) {
                return res.serverError(err);
            }).pipe(res);
        });

    }
};

