const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
    
            post.comments.push(comment);
            post.save();
            req.flash('success', 'Comment Published!');
            return res.redirect('/');
            
        }
    }
    catch(err){
        req.flash('error', 'Error in Publishing Comment');
        console.log('Error in comments_controller create function', err);
        return res.redirect('/');
    }

}

module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;

            comment.remove();

            let post = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}})
            req.flash('success', 'Comment Deleted!');
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    }
    catch(err){
        console.log('Error in comments_controller create action', err);
        req.flash('error', 'Error in Deleting Comment!');
        return res.redirect('back');
    }       
}