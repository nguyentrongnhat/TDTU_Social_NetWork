const express = require('express');
const router = express.Router();
const loginController = require('../controllers/LoginController');
const passport = require('passport');


router.get('/', loginController.showLoginPage)
router.post('/local', loginController.beforeLogin, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), loginController.handleLogin)
router.get('/auth/google/callback', loginController.beforeLogin, passport.authenticate('google', { failureRedirect: '/login' }), loginController.afterGoogleLogin)
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

module.exports = router;