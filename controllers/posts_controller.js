const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const User = require('../models/user');


// this is the action to create a post
module.exports.create = async function(req, res){
    try{
        let user = await User.findById(req.body.user);
        let post = await Post.create({

            content: req.body.content,
            user: req.user._id
        });

        user.posts.push(post);
        user.save();
        
        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    post: post,
                    user: user
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
  
}

// This is the action for deleting a post
module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);
        

        if (post.user == req.user.id){

            // delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            post.remove();

            await Comment.deleteMany({post: req.params.id});

            // get the user id so as to search in DB
            let userId = post.user;

            // find out the user in the DB and update its posts array(remove that post from DB)
            await User.findByIdAndUpdate(userId, { $pull: {posts: req.params.id}});

            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}

//CHANGE: This is the action for hiding a post from the feed
module.exports.hide = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);
  
        await Post.updateOne({_id: post._id},{$set: { isHidden: true } });
        req.flash('success', 'Post is now hidden')
        return res.redirect('/');
    }
    catch(err){
        req.flash('error', 'You are not authorised to hide this post');
        return res.redirect('/');
    }
}