/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
		create: function(req, res){
		Message.create( req.params.all(), function messageCreated(err, message){
			if(err){
				console.log(err);
				req.session.flash = {
					err: err
				}
				
			}
			
			User.message(req.param('to'), {from:req.param('from'), content: req.param('content')}, req);
			
		});
	},
	
	getMyMessages: function(req, res){
		Message.find({to: req.session.user.id}).populate('from').limit(4).sort('createdAt DESC').exec(function messagesFound(err, messages){
			if (err) return next(err);
			res.send(messages);
		 });
	},
	
	getNewMessages: function(req, res){
		Message.find({to: req.session.user.id, new: true})
		.populate('from').sort('createdAt DESC').exec(function messagesFound(err, messages){
			if (err) return next(err);
			res.send(messages);
		 });
	},

	getConversation: function(req, res){
		Message.find({to: req.session.user.id}).
		populate('from').limit(4)
		.sort('createdAt DESC').exec(function messagesFound(err, messages){
			if (err) return next(err);
			res.send(messages);
		 });
	},
	
};

