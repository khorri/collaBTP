/**
 * PaymentMethodController
 *
 * @description :: Server-side logic for managing Paymentmethods
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	create: function (req, res) {
		PaymentMethod.create({
			label: req.param('label'),
			order: req.param('order'),
			percentage: req.param('percentage')
		}).exec(function (error, paymentMethod) {
			if (error) {
				console.log(error);
			} else {
				res.json(paymentMethod);
			}
		});
	},

	getAll: function (req, res) {
		PaymentMethod.find().where({
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
		PaymentMethod.findOne({
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

	getBySubProject: function (req, res) {
		PaymentMethod.find({
			subProject: req.param('subproject')
		}).populateAll().exec(function (err, pms) {
			if (err) {
				res.send(500, {
					error: err
				});
			} else {
				SubProject.findOneById(req.param('subproject')).populateAll().exec(function(err, subproject){
					if (err) {
						res.send(500, {
							error: err
						});
					}else{
						res.json({pms:pms, subproject:subproject});
					}
				})
				
			}
		});
	},

	remove: function (req, res) {
		PaymentMethod.update({
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
		PaymentMethod.update({
			id: req.param('id')
		}, {
			label: req.param('label'),
			order: req.param('order'),
			percentage: req.param('percentage')
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