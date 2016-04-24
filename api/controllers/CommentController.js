/**
 * CommentController
 *
 * @description :: Server-side logic for managing Comments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var self = module.exports = {
	sendAndSave : function(req,res){
        var attachment = [];
        if(req.param('attachment') && req.param('attachment').length)
            attachment = req.param('attachment').map(function(file){
                return {
                    name: file.name,
                    path: file.absolutePath
                }
            });

        console.log("Start saving the message...");
        Comment.create({
            content:req.param('html'),
            subject:req.param('subject'),
            sender:req.param('sender'),
            recipient:req.param('to'),
            from:req.param('from'),
            attachment:req.param('attachment'),
            project:req.param('project')
        }).exec(function(error,result){
            if(error){
                console.log(error);
                return res.json({
                    error: error,
                    info: "An error occurred while sending the message!!"
                });
            }
            else{
                console.log("message saved with success, So start sending the message or return the message");
                if(!req.param('to') || req.param('to').length===0)
                    return res.json(result);
                emailService.send({
                    from : req.param('from'),
                    to :req.param('to'),
                    subject: req.param('subject'),
                    html:req.param('html'),
                    text:req.param('text'),
                    attachment :attachment}, function (err, info) {
                    if (err) {

                        console.log(err);
                        self.removeMessage(result.id);
                        return res.json({
                            error: err,
                            info: info
                        })
                    } else {
                        console.log("Message sent to their recipients :)");
                        return res.json(result)
                    }
                })
            }

        });


    },
    removeMessage : function(req,res){
        //remove the message
        Comment.update({
            id: req.param('id')
        },{
            isDeleted:true
        }).exec(function (err, result) {
            if (err) {
                console.log('An error occurred while removing a comment...');
                res.send(500, {
                    error: err
                });
            } else {
                console.log('The comment is removed successfully...');
                res.json(result);
            }
        });
    },
    getAll : function(req, res){
        Comment.find().where({isDeleted:false}).sort({ createdAt: 'desc' }).populateAll().exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {

                res.json(result);
            }
        });
    },

    getByProject : function(req, res){
        Comment.find().where({isDeleted:false,project:req.param('project')}).sort({ createdAt: 'desc' }).populateAll().exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {

                res.json(result);
            }
        });
    }

}

