/**
 * CoreController
 *
 * @description :: Server-side logic for managing Cores
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req, res) {
		if (req.session.authenticated) {
			res.redirect('/myspace')
		}
		res.view({ layout: 'staticlayout' });
    },
	
	myspace: function(req, res){
		res.view('app/myspace')
	}
};

