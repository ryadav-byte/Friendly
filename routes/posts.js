const express =  require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');

router.post('/create', passport.checkAuthentication, postsController.create);
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);

// CHANGE: this route will be used to hide a post
router.get('/hide/:id', passport.checkAuthentication, postsController.hide);

module.exports = router;
