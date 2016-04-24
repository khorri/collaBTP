/**
 * DocExaminationController
 *
 * @description :: Server-side logic for managing Docexaminations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function (req, res) {
		DocExamination.create({
			label: req.param('label'),
			description: req.param('description'),
			mailNum: req.param('mailNum'),
			project: req.param('project'),
			contributor: req.param('contributor'),
		}).exec(function (error, result) {
			if (error) {
				console.log(error);
			} else {
				DocExamination.findOneById(result.id).populateAll().exec(function (err, docexam) {
					if (error) {
						console.log(error);
					} else {
						res.json(docexam);
					}
				});
			}
		});
	},


	getAll: function (req, res) {
		DocExamination.find().where({
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

	getAllByProject: function (req, res) {
		DocExamination.find().where({
			'project': req.param('id'),
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
		DocExamination.findOne().where({
			'id': req.param('id'),
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

	remove: function (req, res) {
		DocExamination.update({
			id: req.param('id')
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

	update: function (req, res) {
		DocExamination.update({
			id: req.param('id')
		}, {
			label: req.param('label'),
			description: req.param('description'),
			mailNum: req.param('mailNum'),
			contributor: req.param('contributor')
		}).exec(function (err, result) {
			if (err) {
				res.send(500, {
					error: err
				});
			} else {
				DocExamination.find({
					'project': req.param('project'),
					'isDeleted': false
				}).populateAll().exec(function (err, result) {
					if (err) {
						console.log(err)
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

	sendEmail: function (req, res) {
		emailService.sendEmail(req.param('from'), req.param('to'), req.param('subject'), req.param('text'), req.param('html'), req.param('attachments'), function (err, info) {
			if (err) {
				console.log(err)
				return res.json({
					error: err,
					info: info
				})
			} else {
				return res.json({
					info: info
				})
			}
		})
	}
};