/**
 * MissionController
 *
 * @description :: Server-side logic for managing Missions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');

module.exports = {
	getAll: function (req, res) {
		Mission.find().where({
			'isDeleted': false
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
}