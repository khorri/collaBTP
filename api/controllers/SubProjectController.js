/**
 * SubProjectController
 *
 * @description :: Server-side logic for managing Subprojects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var async = require('async');

module.exports = {
	getByProject: function (req, res) {
		SubProject.find({
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
    getAll: function (req, res) {
        SubProject.find({
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
		SubProject.findOne({
			'id': req.param('id'),
			'isDeleted': false
		}).populateAll().exec(function (err, result) {
			if (err) {
				console.log(err)
				res.send(500, {
					error: err
				});
			} else {
				return res.json(result);
			}
		});
	},


	remove: function (req, res) {
		SubProject.update({
			id: req.param('subprojectId')
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

	dropMissions: function (req, res) {
		SubProject.findOne({
			'id': req.param('id'),
		}).populate('missions').exec(function (err, subproject) {
			async.eachSeries(subproject.missions, function (mission, cb) {
				subproject.missions.remove(mission.id);
				cb();
			}, function (err) {
				subproject.save(function (err) {
					if (err)
						console.log(err);
					return res.json(subproject);
				})
			});
		})
	},

	update: function (req, res) {
		SubProject.update({
			'id': req.param('id'),
		}, {
			budget: req.param('budget'),
			missions: req.param('missions')
		}).exec(function (err, subproject) {
			SubProject.findOne({
				'id': req.param('id'),
			}).populate('paymentMethods').exec(function (err, subproject) {
				if (err) {
					res.send(500, {
						error: err
					});
				} else {
					async.each(subproject.paymentMethods, function (pm, callback) {
						PaymentMethod.destroy({
							id: pm.id
						}).exec(function (err) {
							subproject.paymentMethods.remove(pm.id);
							callback();
						})
					}, function (err) {
						subproject.save(function (err) {
							if (err) {
								console.log(err);
								res.send(500, {
									error: err
								});
							} else {
								if (req.param('paymentMethods')) {
									async.each(req.param('paymentMethods'), function (pm, callback) {
                                        PaymentMethod.create({
                                            label: pm.label,
                                            percentage: pm.percentage,
                                            subProject: subproject.id
                                        }).exec(function(err, pm){
                                            subproject.paymentMethods.add(pm);
                                            callback();
                                        });
									}, function (err) {
										subproject.save(function (err) {
											SubProject.findOne({
												'id': req.param('id'),
											}).populateAll().exec(function (err, subproject) {
												if (err) {
													res.send(500, {
														error: err
													});
												} else {
													res.json(subproject);
												}
											});
										});
									});
								}
							}
						});
					});
				}
			});
		});
	},

	addSubproject: function (req, res) {
		SubProject.create({
			project: req.param('id'),
			budget: req.param('budget'),
		}).exec(function (err, subproject) {
			if (err) {
				console.log(err);
				res.send(500, {
					error: err
				});
			} else {
				if (req.param('missions')) {
					req.param('missions').forEach(function (mission, index) {
						subproject.missions.add(mission.id);
					});
				}
				if (req.param('paymentMethods')) {
					async.each(req.param('paymentMethods'), function (paymentMethod, callback) {
                        PaymentMethod.create({
                            label: paymentMethod.label,
                            percentage: paymentMethod.percentage,
                            subProject: subproject.id
                        }).exec(function(err, pm){
                            subproject.paymentMethods.add(pm);
                            callback();
                        });
					}, function (err) {
						subproject.save(function (err) {
							if (err) {
								console.log(err);
								res.send(500, {
									error: err
								});
							} else {
								SubProject.findOne(subproject.id).populateAll().exec(function (err, sp) {
									if (err) {
										console.log(err);
										res.send(500, {
											error: err
										});
									}
									return res.json(sp);
								});
							}
						});
					});
				}
			}
		});
	},
    getTotalBilling:function(req, res){
        console.log("Start getting totals amount for the project :"+req.param('id'));
        SubProject.find().where({
            'project': req.param('id'),
            'isDeleted': false
        }).populateAll().exec(function (err, result) {
            if (err) {
                console.log(err)
                res.send(500, {
                    error: err
                });
            } else {
                var totalBilling = 0;
                var totalPaid = 0;
                if (typeof result != 'undefined') {
                    result.forEach(function (item, index, array) {
                        item.bills.forEach(function (bill, i, arr) {
                            totalBilling += bill.amount;
                            if (bill.isPaid)
                                totalPaid += bill.amount;
                        });
                    });
                }
                console.log("totalBilling : "+totalBilling+" totalPaid : "+totalPaid);
                return res.json({"totalBilling":totalBilling,"totalPaid":totalPaid});
            }
        });
    },

};