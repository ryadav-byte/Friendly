const User = require('../models/user');
const bcrypt = require('bcryptjs');

// render the profile page
module.exports.profile = function(req, res){
    
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log('Error in finding user in users_controller');
            return;
        }
        return res.render('user_profile', {
            title: 'Profile',
            profile_user: user
        });

    })
    
};

module.exports.update = async function(req, res){

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('**Multer Error**', err);
                    return;
                }

                user.email = req.body.email;
                user.name = req.body.name;

                if(req.file){
                    // this is saving the path of the uploaded file into avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }
        catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    }
    else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


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
module.exports.create = async function(req, res){

    try{
        const user =  await User.findOne({email: req.email});

        //CHANGE: get the hashed password
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
    
            if(!user){
                let role = 'user'
                //CHANGE: check if it is an admin and assign the role of admin to this user. 
                // Assigning admin role to a user can be done on the conditions given. 
                //It may belong to some email group or any such identity which will help to distinguish the admin
                if(req.body.email == 'admin@friendly.com'){
                    role = 'admin'
                }
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    role: role
                }, function(err, user){
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
    }
    catch(err){
        req.flash('error', err);
        console.log('Error in signing up', err);
        return res.redirect('back');
    }

    
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully!');
    return res.redirect('/'); 
}

module.exports.destroySession = function(req, res){
    
    req.logout();
    
    req.flash('success', 'You have logged out!');
    res.redirect('/');
}