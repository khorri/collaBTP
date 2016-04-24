/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    getById: function (req, res) {
        User.findOne({
            'id': req.param('id')
        }).populateAll().exec(function (err, result) {
            if (err) {
                console.log(err);
                res.send(500, {
                    error: err
                });
            } else {
                return res.json(result);
            }
        });
    },

    signup: function (req, res) {
        if (req.session.authenticated) {
            res.redirect('/myspace')
        }
        res.view({
            layout: 'staticlayout'
        });
    },

    create: function (req, res) {
        User.create(req.params.all(), function userCreated(err, user) {
            if (err) {
                console.log(err);
                res.send(500,{error:err});
                /*
                 req.session.flash = {
                 err: err
                 }

                 return res.redirect('/signup');
                 */
            }else{
                return res.json(user);
            }
            /*
             req.session.authenticated = true;
             req.session.user = user;

             user.online = true;
             user.save(function (err, user) {
             if (err) return next(err)

             User.publishCreate(user);
             res.redirect('/myspace');
             });
             */
        });
    },

    getAll: function (req, res) {
        User.find().where({isDeleted:false}).populateAll().exec(function (err, result) {
            if (err) {
                res.send(500, {
                    error: err
                });
            } else {
                res.json(result);
            }
        });
    },

    getDirectersAndEngineers: function (req, res) {
        Permission.findOne().where({title:'Chef de projet'}).populateAll().exec(function (err,permission) {
            if (err) {
                res.send(500, {
                    error: err
                });
            }
            else{
                var r =permission.roles.map(function(role){
                    return {role:role.id};
                });
                User.find().where({
                    or: r
                }).populateAll().exec(function (err, users) {
                    if (err) {
                        res.send(500, {
                            error: err
                        });
                    } else {
                        return res.json(users);
                    }
                });
            }
        });

    },

    loggedUser: function (req, res, next) {
        res.json(req.session.user)
    },

    subscribe: function (req, res) {
        User.find({
            id: req.param('userID')
        }).exec(function found(err, user) {
            if (err) return next(err);
            User.subscribe(req.socket, user, ['update', 'destroy']);
            res.send(200);
        });

    },
    update: function (req, res) {

        User.update({
            id: req.param('id')
        }, {
            name:req.param('name'),
            email:req.param('email'),
            role:req.param('role'),
            phone:req.param('phone'),
            password:req.param('password'),
            confirmation:req.param('confirmation')
        }).exec(function (err, result) {
            if (err) {
                console.log(err);
                res.send(500, {
                    error: err,
                    message:'Could not update the user!!!'
                });
            } else {
                console.log("User updated successfully.");
                res.json(result);
            }
        });
    },

    remove: function (req, res) {
        User.update({
            id: req.param('userId')
        },{
            isDeleted:true
        }).exec(function (err, result) {
            if (err) {
                console.log('An error occurred while removing a user...');
                res.send(500, {
                    error: err
                });
            } else {
                console.log('The user is removed successfully...');
                res.json(result);
            }
        });
    }
};