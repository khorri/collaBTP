/**
 * TypeController
 *
 * @description :: Server-side logic for managing Types
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    create: function (req, res) {
        Type.create({
            name: req.param('name'),
            description: req.param('description')
        }).exec(function (error, activity) {
            if (error) {
                console.log(error);
            } else {
                return res.json(activity);
            }
        });
    },

    update: function (req, res) {
        Type.update({
            id: req.param('id')
        }, {
            name: req.param('name'),
            description: req.param('description')
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

    getAll: function (req, res) {
        Type.find().populateAll().exec(function (err, result) {
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
        Type.findOne({
            'id': req.param('id')
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
    remove: function (req, res) {
        Type.destroy({
            id: req.param('id')
        }).exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                res.json(result);
            }
        });
    }
};