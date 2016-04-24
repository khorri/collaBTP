//@File: PdfGeneratorService.js - in api/services
//@Author: Nizar Oukhchi
//@Description: A service to help generate pdf based on html templates

var fs = require('fs'),
    handlebars = require('handlebars'),
    pdf = require('html-pdf'),
    mkdirp = require('mkdirp'),
    Handlebars = require('handlebars'),
    Swag = require('swag');

module.exports = {

    /**
     * @author Nizar Oukhchi
     * @brief Generation d'un document dans le dossier .tmp/public/documents"
     * @param [data: Object] les donnÃ©es Ã  inserer dans le document au format Objet json
     * @param [templateName: string] Le nom du template Ã  utiliser pour la generation du document. (ex: contractTemplate.docx)
     * @param [outputName: string] le nom du document Ã  generer sans l'extention.
     * @param fonction callback exÃ©cutÃ© Ã  la fin de la generation avec l'objet File gÃ©nÃ©rÃ©
     * @param [header: boolean] avec ou sans header
     */
    generate: function (data, templateName, outputName,callback, header) {
        fs.exists("assets/documents/htmlTemplates/" + templateName, function (exists) {
            if (exists) {
                fs.readFile("assets/documents/htmlTemplates/" + templateName, function (err, src) {
                    if (!err) {
                        // make the buffer into a string
                        var source = src.toString();
                        var template = handlebars.compile(source);
                        Handlebars.registerHelper("inc", function (value, options) {
                            return parseInt(value) + 1;
                        });
                        Swag.registerHelpers(Handlebars);
                        var options;
                        if (header) {
                            options = {
                                filename: '.tmp/public/documents/' + outputName + '.pdf',
                                format: 'A4',
                                orientation: "portrait",
                                type: "pdf",
                                header: {
                                    height: "40mm",
                                    "contents": '<div style="width: 90%;padding: 10px;display: block;margin-left: auto;margin-right: auto;height: 120px;border-bottom: solid 1px #ddd;"><div style="float:left"><h1 style="margin: 0;font-size: 18px;color: rgb(85, 157, 218);">RISK CONTROL</h1><h3 style="margin: 0;font-size: 14px;color: #EF3737;">Bureau de Contrôle</h3><p style="margin-top: 2px;margin-bottom: 0;font-size: 12px;color: rgb(125, 60, 157);line-height: 13px;">GH4B IMM 25 ENS RESID ARREDA APPAT 3<br> OULFA - CASABLANCA - CP : 20200<br> Tél : 0522 01 38 06 - Fax : 0522 91 33 61<br> E-mail : contact@rcomaroc.com<br> Web : www.rcomaroc.com </p></div><div style="float: right"><img src="http://www.rcomaroc.com/wp-content/uploads/2014/12/LOGO12.jpg" width="100%"></div></div>'
                                },
                                footer: {
                                    "height": "28mm"
                                },
                                phantomPath: "./node_modules/phantomjs/bin/phantomjs",
                                timeout: 600000
                            };
                        } else {
                            options = {
                                filename: '.tmp/public/documents/' + outputName + '.pdf',
                                format: 'A4',
                                orientation: "portrait",
                                type: "pdf",
                                header: {
                                    height: "40mm"
                                },
                                footer: {
                                    "height": "28mm"
                                },
                                phantomPath: "./node_modules/phantomjs/bin/phantomjs",
                                timeout: 600000
                            };
                        }
                        var result = template(data);
                        pdf.create(result, options).toFile(function (err, res) {
                            if (err) return console.log(err);
                            callback(result);
                        });

                    } else {
                        console.log("Error while reading template file")
                    }
                });
            } else {
                console.log("Template file doesn't exist")
            }

        });
    },


    /**
     * @author Nizar Oukhchi
     * @brief Generation d'un document sans marge (20mm) dans le dossier .tmp/public/documents"
     * @param [data: Object] les donnÃ©es Ã  inserer dans le document au format Objet json
     * @param [templateName: string] Le nom du template Ã  utiliser pour la generation du document. (ex: contractTemplate.docx)
     * @param [outputName: string] le nom du document Ã  generer sans l'extention.
     * @param fonction callback exÃ©cutÃ© Ã  la fin de la generation avec l'objet File gÃ©nÃ©rÃ©
     * @param [header: boolean] avec ou sans header
     */
    generateWithoutMargin: function (data, templateName, outputName, callback, header) {
        fs.exists("assets/documents/htmlTemplates/" + templateName, function (exists) {
            if (exists) {
                fs.readFile("assets/documents/htmlTemplates/" + templateName, function (err, src) {
                    if (!err) {
                        // make the buffer into a string
                        var source = src.toString();
                        var template = handlebars.compile(source);
                        Handlebars.registerHelper("inc", function (value, options) {
                            return parseInt(value) + 1;
                        });
                        Swag.registerHelpers(Handlebars);
                        var options = {
                            filename: '.tmp/public/documents/' + outputName + '.pdf',
                            format: 'A4',
                            orientation: "portrait",
                            type: "pdf",
                            phantomPath: "./node_modules/phantomjs/bin/phantomjs",
                            timeout: 600000
                        };

                        var result = template(data);
                        pdf.create(result, options).toFile(function (err, res) {
                            if (err) return console.log(err);
                            callback(result);
                        });

                    } else {
                        console.log("Error while reading template file")
                    }
                });
            } else {
                console.log("Template file doesn't exist")
            }

        });
    },

    /**
     * @author Nizar Oukhchi
     * @brief Generation d'un document sans marge (20mm) dans le dossier .tmp/public/documents"
     * @param [data: Object] les donnÃ©es Ã  inserer dans le document au format Objet json
     * @param [templateName: string] Le nom du template Ã  utiliser pour la generation du document. (ex: contractTemplate.docx)
     * @param [outputName: string] le nom du document Ã  generer sans l'extention.
     * @param fonction callback exÃ©cutÃ© Ã  la fin de la generation avec l'objet File gÃ©nÃ©rÃ©
     * @param [header: boolean] avec ou sans header
     */
    generateContrat: function (data, templateName,ref, outputName, callback, header) {
        console.log(' REF: '+ref);
        console.log('Template Name : '+templateName);
        fs.exists("assets/documents/htmlTemplates/"+ templateName, function (exists) {
            if (exists) {
                fs.readFile("assets/documents/htmlTemplates/" + templateName, function (err, src) {
                    if (!err) {
                        // make the buffer into a string
                        var source = src.toString();
                        var template = handlebars.compile(source);
                        Handlebars.registerHelper("inc", function (value, options) {
                            return parseInt(value) + 1;
                        });
                        Swag.registerHelpers(Handlebars);
                        var options = {
                            filename: '.tmp/public/documents/' + outputName + '.pdf',
                            format: 'A4',
                            orientation: "portrait",
                            type: "pdf",
                            header: {
                                height: "28mm",
                                "contents": '<div style="width: 90%;padding: 10px;display: block;margin-left: auto;margin-right: auto;height:40px;border-bottom: solid 1px #ddd;"><div style="float:left"><h1 style="margin: 0;font-size: 18px;">'+data.ourCompany+'</h1><h3 style="margin: 0;font-size: 14px;">Bureau de Contr&ocirc;le</h3></div><div style="float: right">convention n°:'+ref+'</div></div>'


                            },
                            footer: {
                                "height": "28mm",
                                "contents": '<div class="footer"><span>{{page}}</span>/<span>{{pages}}</span></div>'

                            },
                            phantomPath: "./node_modules/phantomjs/bin/phantomjs",
                            timeout: 600000
                        };

                        var result = template(data);
                        pdf.create(result, options).toFile(function (err, res) {
                            if (err) return console.log(err);
                            callback(result);
                        });

                    } else {
                        console.log("Error while reading template file")
                    }
                });
            } else {
                console.log("Template file doesn't exist")
            }

        });
    }

};