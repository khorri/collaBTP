/**
 * CustomerController
 *
 * @description :: Server-side logic for managing Customers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    create: function (req, res) {
        Customer.create(req.params.all()).exec(function (error, result) {
            if (error) {
                res.json({
                    error: "DB Error"
                });
            } else {
                res.json(result);
            }
        });
    },

    getAll: function (req, res) {
        Customer.find().where({
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
        Customer.findOne({
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
        Customer.update({
            id: req.param('id')
        }, {
            'contactPerson': req.param('contactPerson'),
            'phone': req.param('phone'),
            'email': req.param('email'),
            'address': req.param('address'),
            'company': req.param('company'),
            'cellphone': req.param('cellphone'),
            'zip': req.param('zip'),
            'type': req.param('type'),
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
        Customer.update({
            id: req.param('customerID')
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
};