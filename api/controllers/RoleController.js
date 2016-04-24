/**
 * RoleController
 *
 * @description :: Server-side logic for managing Roles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    create: function (req, res) {
        Role.create({
            title: req.param('title'),
            description: req.param('description')
        }).exec(function (error, role) {
            if (error) {
                res.json({error: "DB Error"});
            } else {
                if (req.param('permissions')) {
                    req.param('permissions').forEach(function (permission, index) {
                        role.permissions.add(permission.id);
                    });
                    role.save(function (err) {
                        return res.json(role);
                    });
                }

            }
        });
    },
    getAll: function (req, res) {
        Role.find({
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
    update: function (req, res) {
        Role.update({
            id: req.param('id')
        }, {
            title: req.param('title'),
            description: req.param('description'),
            permissions: req.param('permissions')
        }).exec(function (error, result) {
            if (error) {
                res.json({error: "DB Error"});
            } else {
                res.json(result);
            }
        });
    },
    remove: function (req, res) {
        Role.update({
            id: req.param('id')
        }, {
            isDeleted: true
        }).exec(function (error, result) {
            if (error) {
                res.json({error: "DB Error"});
            } else {
                res.json(result);
            }
        });
    }
};

