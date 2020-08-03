const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
const passport = require('passport');

router.get('/',passport.checkAuthentication, homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/api', require('./api'));
router.use('/likes', require('./likes'));
// CHANGE: This is the route for dashboard, corresponding action homeController.dashboard is provided
router.use('/dashboard',passport.checkAuthentication, homeController.dashboard);

//for any further routes, access from here
// router.use('/routerName', require('./routerfile'));
module.exports = router;