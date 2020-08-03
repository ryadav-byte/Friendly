const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){

    try{
        // populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
      })

        let users = await User.find({});

        return res.render('../views/home', {
            title: 'Friendly | Home',
            posts: posts,
            all_users: users
        });
    
    }
    catch(err){
        console.log('Error in home_controller', err);
        return;
    }
                        
}


// CHANGE: This is the action to render dashboard
module.exports.dashboard = async function(req, res){
    try{
        // populate the posts of each user
        let users = await User.find({})
        .sort('-createdAt')
        .populate({
            path: 'posts',
            populate:{
                path: 'comments'
            },
            populate:{
                path: 'user'
            },
            populate:{
                path: 'likes'
            }
        });

        return res.render('../views/dashboard', {
            title: 'Dashboard | Admin',
            all_users: users, 
        });
    
    }
    catch(err){
        console.log('Error in dashboard action', err);
        return;
    }
}
