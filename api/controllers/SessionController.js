/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var bcrypt = require('bcryptjs');
module.exports = {

	login: function (req, res) {
		if (req.session.authenticated) {
			res.redirect('/myspace')
		} else {
			res.view({
				layout: 'staticlayout'
			});
		}
	},

	create: function (req, res, next) {

		if (!req.param('email') || !req.param('password')) {
			var usernamePasswordRequiredError = [{
				name: 'usernamePasswordRequired',
				type: 'Oh snap!',
				message: 'You must enter both a username and password.'
			}]

			req.session.flash = {
				err: usernamePasswordRequiredError
			}

			res.redirect('/login');
			return;
		}

		User.findOneByEmail(req.param('email')).populate('settings').exec(function (err, user) {
			if (err) return next(err);

			if (!user) {
				var noAccountError = [{
					name: 'noAccount',
					type: 'Oh snap!',
					message: 'The email address ' + req.param('email') + ' not found.'
				}]
				req.session.flash = {
					err: noAccountError
				}

				res.redirect('/login');
				return;
			}

			bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid) {
				if (err) return next(err);

				if (!valid) {
					var usernamePasswordMismatchError = [{
						name: 'usernamePasswordMismatch',
						type: 'oh snap!',
						message: 'Invalid username and password combination.'
					}];
					req.session.flash = {
						err: usernamePasswordMismatchError
					}

					res.redirect('/login');
					return;
				}

				req.session.authenticated = true;
				req.session.user = user;
				user.online = true;
				user.logoutAt = new Date();

				//emailService.init(user);


				user.save(function (err, user) {
					if (err) return next(err)

					//					User.publishUpdate(user.id, {
					//						loggedIn: true,
					//						user: user
					//					});
					res.redirect('/myspace');
				});

			})
		})
	},

	destroy: function (req, res, next) {
		if (!req.session.authenticated) {
			res.redirect('/index');
		} else {
			User.findOne(req.session.user.id, function foundUser(err, user) {
				var userId = req.session.user.id;

				User.update(userId, {
					online: false,
					logoutAt: new Date()
				}, function (err) {
					if (err) return next(err);
					//					User.publishUpdate(user.id, {
					//							loggedIn: false,
					//							user: user
					//						});
					req.session.destroy();
					res.redirect('/index');
				});
			});
		}
	},


	/* MOBILE SESSION MANAGEMENT */

	createmobile: function (req, res, next) {

		if (!req.param('email') || !req.param('password')) {
			var usernamePasswordRequiredError = {
				login: false,
				name: 'usernamePasswordRequired',
				type: 'Oh snap!',
				message: 'You must enter both a username and password.'
			};


			res.json(usernamePasswordRequiredError);
			return;
		}

		User.findOneByEmail(req.param('email')).populate('settings').exec(function (err, user) {
			if (err) return next(err);

			if (!user) {
				var noAccountError = {
					login: false,
					name: 'noAccount',
					type: 'Oh snap!',
					message: 'The email address ' + req.param('email') + ' not found.'
				};

				res.json(noAccountError);
				return;
			}

			bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid) {
				if (err) return next(err);

				if (!valid) {
					var usernamePasswordMismatchError = {
						login: false,
						name: 'usernamePasswordMismatch',
						type: 'oh snap!',
						message: 'Invalid username and password combination.'
					};

					res.json(usernamePasswordMismatchError);
					return;
				}

				req.session.authenticated = true;
				req.session.user = user;
				user.online = true;
				user.logoutAt = new Date();

				//emailService.init(user);


				user.save(function (err, user) {
					if (err) return next(err)

					User.publishUpdate(user.id, {
						loggedIn: true,
						user: user
					});
					res.json({
						login: true
					});
				});

			})
		})
	},
	destroymobile: function (req, res, next) {
		if (!req.session.authenticated) {
			res.json({
				authenticated: false,
				disconnected: false
			});
		} else {
			User.findOne(req.session.user.id, function foundUser(err, user) {
				var userId = req.session.user.id;

				User.update(userId, {
					online: false,
					logoutAt: new Date()
				}, function (err) {
					if (err) return next(err);
					User.publishUpdate(user.id, {
						loggedIn: false,
						user: user
					});
					req.session.destroy();
					res.json({
						authenticated: false,
						disconnected: true
					});
				});
			});
		}
	},
};