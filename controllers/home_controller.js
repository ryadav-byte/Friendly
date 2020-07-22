const Post = require('../models/post');

module.exports.home = function(req, res){

    // populate the user of each post

    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){
        if(err){
            console.log('Error in populating the user for post', err)
        }
        return res.render('../views/home', {
            title: 'Friendly | Home',
            posts: posts
        });
    });
}

//module.exports.actionName = function(req, res){};

