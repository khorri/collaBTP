/**
 * SettingsController
 *
 * @description :: Server-side logic for managing Settings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    get: function (req, res) {
        Settings.find().populateAll().exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                res.json(result[0]);
            }
        });
    },
    create: function(req, res) {
        Settings.create(req.params.all()).exec(function(error, result) {
            if (error) {
                res.json({error: "DB Error"});
            } else {
                res.json(result);
            }
        });
    },
    update: function(req, res) {

        Settings.update({id:req.param('id')},
            {
                companyName:req.param('companyName'),
                email:req.param('email'),
                phone1:req.param('phone1'),
                phone2:req.param('phone2'),
                fax:req.param('fax'),
                address:req.param('address')
            }).exec(function(error, result) {
            if (error) {
                res.json({error: "DB Error"});
            } else {
                res.json(result);
            }
        });
    }
};

