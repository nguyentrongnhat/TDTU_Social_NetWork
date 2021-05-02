const Post = require('../models/Post');
const User = require('../models/User');
const React = require('../models/React');
const Comment = require('../models/Comment');
const { post } = require('../routes/IndexRoute');

const getYouTubeID = require('get-youtube-id');
const mongoose = require('mongoose');
const fs = require('fs');


const bcrypt = require('bcrypt');
const saltRounds = 3;
const cookieParser = require('cookie-parser');

class AdminController {
    showAdminPage (req, res) {
        let {user} = req;
        User.find({}).sort({ _id: -1 })
        .then(users => {
            return res.render('admin', { layout: './layouts/onenav_layout', user, users });
        })
    }
    addUser (req, res) {
        let { username, email, password, role } = req.body;
        let display_name = username;
        let family_name = username;
        let mssv = email.slice(0, email.indexOf('@'));

        const salt = bcrypt.genSaltSync(saltRounds);
        password = bcrypt.hashSync(password, salt);

        var newUser = new User({ display_name, family_name, email, mssv, password, role });
        let path = './public/uploads/' + mssv;

        fs.access(path, function(error) {
            if (error) {
                fs.mkdirSync('./public/uploads/' + mssv);
            }
        })
        newUser.save(function (err) {
            console.log(err);
        });
        return res.redirect("/admin");
    }

    notifyManager(req, res) {
        let user = req.user;
        User.find({ $or:[ {role: 'Department'}, {role: 'Admin'} ]})
        .then(departments => {
            return res.render('admin_manager_notify', {layout: './layouts/onenav_layout', departments, user});
        })
    }
}

module.exports = new AdminController;