//@File: DocGenService.js - in api/services
//@Author: Nizar Oukhchi
//@Description: A service that generate doc based on templates

var fs = require('fs'),
    Docxtemplater = require('docxtemplater'),
    XlsxTemplater = require('xlsx-template'),
    mkdirp = require('mkdirp');

module.exports = {

    /**
     * @author Nizar Oukhchi
     * @brief Generation d'un document dans le dossier .tmp/public/documents"
     * @param [data: Object] les données à inserer dans le document au format Objet json
     * @param [templateName: string] Le nom du template à utiliser pour la generation du document. (ex: contractTemplate.docx)
     * @param [outputName: string] le nom du document à generer sans l'extention.
     * @param fonction callback exécuté à la fin de la generation avec l'objet File généré
     *
     *
     */
    generateDoc: function (data, templateName, outputName, callback) {

        fs.exists("assets/documents/docTemplates/" + templateName, function (exists) {
            if (exists) {
                var sExt = templateName.split('.');
                var ext = sExt[sExt.length - 1];
                if (ext == 'docx') {
                    var template = fs.readFileSync("assets/documents/docTemplates/" + templateName, "binary")

                    var doc = new Docxtemplater(template);
                    doc.setData(data);
                    doc.render();

                    var buf = doc.getZip()
                        .generate({
                            type: "nodebuffer"
                        });

                    fs.writeFileSync(".tmp/public/documents/" + outputName + "." + ext, buf);
                    File.create({
                        'name': outputName + '.' + ext,
                        'nameInDisk': outputName + '.' + ext,
                        'type': 'document',
                        'ext': ext,
                        'webPath': '/documents/' + outputName + '.' + ext,
                        'absolutePath': sails.config.appPath + '/.tmp/public/documents/' + outputName + '.' + ext
                    }).exec(function (err, file) {
                        if (err) {
                            console.log(err)
                            return false;
                        }

                        callback(file);
                    });
                } else if (ext == 'xlsx') {
                    fs.readFile("assets/documents/docTemplates/" + templateName, function (err, template) {
                        var doc = new XlsxTemplater(template);
                        var sheetNumber = 1;
                        var ext = 'xlsx'
                        doc.substitute(sheetNumber, data);
                        var buf = doc.generate();
                        fs.writeFileSync(".tmp/public/documents/" + outputName + "." + ext, buf, "binary");
                        File.create({
                            'name': outputName + '.' + ext,
                            'nameInDisk': outputName + '.' + ext,
                            'type': 'document',
                            'ext': ext,
                            'webPath': '/documents/' + outputName + '.' + ext,
                            'absolutePath': sails.config.appPath + '/.tmp/public/documents/' + outputName + '.' + ext
                        }).exec(function (err, file) {
                            if (err) {
                                console.log(err)
                                return false;
                            }
                            callback(file);
                        });
                    });
                }

            } else {
                console.log('TempFile doesnt exist')
                return false

            }
        });
    }
}