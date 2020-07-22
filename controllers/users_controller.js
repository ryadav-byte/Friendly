const User = require('../models/user');


// render the profile page
module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'Profile'
    });
};


// render the signIn page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: 'Friendly | Sign In'
    });
}


// render the signUp page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: 'Friendly | Sign Up'
    });
}


// get the sign-up data
module.exports.create = function(req, res){

    User.findOne({email: req.email}, function(err, user){
        if(err){
            console.log('error in finding a user while signing up', err);
            return;
        }

        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    console.log('Error in creating user while signing up', err);
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }
        else{
            return res.redirect('back');
        }
    })
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    return res.redirect('/'); 
}

module.exports.destroySession = function(req, res){
    req.logout();
    res.redirect('/');
}