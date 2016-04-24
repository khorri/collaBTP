/**
 * PermissionController
 *
 * @description :: Server-side logic for managing Permissions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    getAll: function (req, res) {
        Permission.find().populateAll().exec(function (err, result) {
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

