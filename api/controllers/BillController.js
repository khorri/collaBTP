/**
 * BillController
 *
 * @description :: Server-side logic for managing Bills
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getProjectBills: function (req, res) {
		Bill.find({
			'project': req.param('project')
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
		Bill.find({
			'subProject': req.param('id')
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

	create: function (req, res) {
		Bill.create({
			subProject: req.param('subProject'),
			amount: req.param('amount'),
		}).exec(function (err, bill) {
			if (err) {
				console.log(err);
				res.send(500, {
					error: err
				});
			} else {
				if (req.param('paymentMethods')) {
					req.param('paymentMethods').forEach(function (pm, index) {
						bill.paymentMethods.add(pm.id);
					});
					bill.save(function (err) {
						return res.json(bill)
					})
				}
			}
		})
	},

	setPayed: function (req, res) {
		Bill.update({
			id: req.param('id')
		}, {
			isPaid: true
		}).exec(function (err, bill) {
			if (err) {
				console.log(err);
				res.send(500, {
					error: err
				});
			} else {
				PaymentMethod.find({
					subProject: req.param('subProject')
				}).populateAll().exec(function (err, paymentMethods) {
					if (err) {
						console.log(err);
						res.send(500, {
							error: err
						});
					} else {
						SubProject.findOneById(req.param('subProject')).populateAll().exec(function (err, result) {
							if (err) {
								console.log(err);
								res.send(500, {
									error: err
								});
							} else {
								return res.json({
									pms: paymentMethods,
									subProject: result
								});
							}
						})
					}
				})
			}
		})
	},

	setNotPayed: function (req, res) {
		Bill.update({
			id: req.param('id')
		}, {
			isPaid: false
		}).exec(function (err, bill) {
			if (err) {
				console.log(err);
				res.send(500, {
					error: err
				});
			} else {
				PaymentMethod.find({
					subProject: req.param('subProject')
				}).populateAll().exec(function (err, paymentMethods) {
					if (err) {
						console.log(err);
						res.send(500, {
							error: err
						});
					} else {
						SubProject.findOneById(req.param('subProject')).populateAll().exec(function (err, result) {
							if (err) {
								console.log(err);
								res.send(500, {
									error: err
								});
							} else {
								return res.json({
									pms: paymentMethods,
									subProject: result
								});
							}
						})
					}
				})
			}
		})
	},

};