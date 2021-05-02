const Post = require('../models/Post');
const User = require('../models/User');
const React = require('../models/React');
const Comment = require('../models/Comment');
const { post } = require('../routes/IndexRoute');

const getYouTubeID = require('get-youtube-id');
const mongoose = require('mongoose');

const session = require('express-session');
const cookieParser = require('cookie-parser');

class LoginController {
    // [get] /login
    showLoginPage(req, res) {
        req.logOut();
        req.session.destroy();
        return res.render('login');
    }

    handleLogin(req, res) {
        if(req.isAuthenticated()) {
            //console.log('test nao')
            //req.flash('message', 'Đăng nhập thành công');
            return res.redirect('/');
        }
        else {
            //req.flash('message', 'Sai tên đăng nhập hoặc mật khẩu');
        } 
    }

    beforeLogin(req, res, next) {
        var hour = 1800000;
        req.session.cookie.expires = new Date(Date.now() + hour);
        req.session.cookie.maxAge = 100 * hour;
        next();
    }

    afterGoogleLogin(req, res) {
        let {email} = req.user;
        //console.log(email)
        //console.log(email.slice(email.indexOf('@'))!=='@student.tdtu.edu.vn')
        if (email.slice(email.indexOf('@'))!=='@student.tdtu.edu.vn'){
            req.logOut();
            req.session.destroy();
            return res.redirect('/login');
        }
        //console.log('sap vao')
        res.redirect('/');    
    }

    isLoggedIn (req, res, next) {
        if(req.isAuthenticated()){
            return next ();
        }
        res.redirect('/login');
    }

    onlyAdmin (req, res, next) {
        if(req.user && req.user.role === 'Admin'){
            return next ();
        }
        res.redirect('/');
    }

    Logged (req, res, next) {
        if(req.isAuthenticated()){
            return res.redirect('/');
        }
        next();
    }
}

module.exports = new LoginController;