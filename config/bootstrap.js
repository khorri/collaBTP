/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

	User.findOrCreate({
		email: 'admin@admin.com'
	}, {
		name: 'super admin',
		email: 'admin@admin.com',
		password: '12345',
		confirmation: '12345'
	}).exec(function createFindCB(err, record) {});

	User.findOrCreate({
		email: 'nizar.oukhchi@gmail.com'
	}, {
		name: 'nizar oukhchi',
		email: 'nizar.oukhchi@gmail.com',
		password: '12345',
		confirmation: '12345'
	}).exec(function (err, record) {});

	User.findOrCreate({
		email: 'aminegriche@gmail.com'
	}, {
		name: 'amine griche',
		email: 'aminegriche@gmail.com',
		password: '12345',
		confirmation: '12345'
	}).exec(function (err, record) {});

	User.findOrCreate({
		email: 'mehdaoui.badr@gmail.com'
	}, {
		name: 'badr mehdaoui',
		email: 'mehdaoui.badr@gmail.com',
		password: '12345',
		confirmation: '12345'
	}).exec(function (err, record) {});

	User.findOrCreate({
		email: 'horrikhalid@gmail.com'
	}, {
		name: 'khalid khalid',
		email: 'khalid.horri@gmail.com',
		password: '12345',
		confirmation: '12345'
	}).exec(function (err, record) {});

	Type.findOrCreate({
		'name': 'ARCHITECTE'
	}, {
		'name': 'ARCHITECTE'
	}).exec(function createFindCB(err, record) {

	});
	Type.findOrCreate({
		'name': 'BET'
	}, {
		'name': 'BET'
	}).exec(function createFindCB(err, record) {

	});
	Type.findOrCreate({
		'name': 'ENTREPRISE'
	}, {
		'name': 'ENTREPRISE'
	}).exec(function createFindCB(err, record) {

	});
	Type.findOrCreate({
		'name': 'LABORATOIRE'
	}, {
		'name': 'LABORATOIRE'
	}).exec(function createFindCB(err, record) {

	});
	Type.findOrCreate({
		'name': 'BUREAU DE COORDINATION'
	}, {
		'name': 'BUREAU DE COORDINATION'
	}).exec(function createFindCB(err, record) {

	});
	Type.findOrCreate({
		'name': "MAITRE D'OUVRAGE"
	}, {
		'name': "MAITRE D'OUVRAGE"
	}).exec(function createFindCB(err, record) {

	});

	Mission.findOrCreate({
		'name': "Gros Oeuvres"
	}, {
		'name': "Gros Oeuvres"
	}).exec(function createFindCB(err, record) {

	});

	Mission.findOrCreate({
		'name': "Etanchéité"
	}, {
		'name': "Etanchéité"
	}).exec(function createFindCB(err, record) {

	});

	Mission.findOrCreate({
		'name': "Plomberie et Electricité"
	}, {
		'name': "Plomberie et Electricité"
	}).exec(function createFindCB(err, record) {

	});

	Role.findOrCreate({
		'title': "Directeur"
	}, {
		'title': "Directeur"
	}).exec(function createFindCB(err, record) {

	});

	Role.findOrCreate({
		'title': "Ingénieur"
	}, {
		'title': "Ingénieur"
	}).exec(function createFindCB(err, record) {

	});
	Role.findOrCreate({
		'title': "Téchnicien"
	}, {
		'title': "Téchnicien"
	}).exec(function createFindCB(err, record) {

	});
	Role.findOrCreate({
		'title': "Assistante"
	}, {
		'title': "Assistante"
	}).exec(function createFindCB(err, record) {});

    Permission.findOrCreate({
        'title': "Ajout"
    }, {
        'title': "Ajout"
    }).exec(function createFindCB(err, record) {});
    Permission.findOrCreate({
        'title': "Modification"
    }, {
        'title': "Modification"
    }).exec(function createFindCB(err, record) {});
    Permission.findOrCreate({
        'title': "Suppression"
    }, {
        'title': "Suppression"
    }).exec(function createFindCB(err, record) {});
    Permission.findOrCreate({
        'title': "Visualisation"
    }, {
        'title': "Visualisation"
    }).exec(function createFindCB(err, record) {});
    Permission.findOrCreate({
        'title': "Chef de projet"
    }, {
        'title': "Chef de projet"
    }).exec(function createFindCB(err, record) {});

	User.update({}, {
			online: false
		},
		function userUpdated(err, users) {
			if (err) {
				console.log(err);
			} else {

			}
			cb();
		}
	);
};