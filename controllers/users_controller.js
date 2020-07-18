module.exports.profile = function(req, res){
    return res.end('<h1>This is a profile<h1>');
}

module.exports.posts = function(req, res){
    res.end('These are few posts');
}