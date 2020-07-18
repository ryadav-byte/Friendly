module.exports.home = function(req, res){
    return res.render('../views/home', {
        title: 'Home'
    });
}

//module.exports.actionName = function(req, res){};

