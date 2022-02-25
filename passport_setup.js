const bcrypt = require('bcrypt');
const saltRounds = 3;

const session = require('express-session')
const fs = require('fs');
const passport = require('passport');
const User = require('./models/User');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use(new GoogleStrategy({
    //clientID: '859864493982-oh0qctooo3s91qkq8lgiit67n4uemvsa.apps.googleusercontent.com',
    //clientSecret: 'yy9VhCFyt8zTdcXduA9eH358',
    //callbackURL: "http://localhost:8181/login/auth/google/callback"

    clientID: '859864493982-49kopgig79bt4r8jr19uign376f8mhgu.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "https://tdtu-social.herokuapp.com/login/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        let google_id = profile.id;
        let display_name = profile.displayName;
        let family_name = profile.name.familyName;
        let email = profile.emails[0].value;
        let role = 'Student';
        let avatar_img = profile.photos[0].value;
        let mssv = email.slice(0, email.indexOf('@'));
        const salt = bcrypt.genSaltSync(saltRounds);
        let password = bcrypt.hashSync(mssv, salt);
        let hd = email.slice(email.indexOf('@'));
        User.findOne({ 'google_id': google_id }, function (err, user) {
            if (err)
                return done(err);
            if (user) {
                //console.log(user)
                return done(null, user);
            } else {
                var newUser = new User({ google_id, display_name, family_name, role, email, mssv, password, avatar_img });
                let path = './public/uploads/' + mssv;

                fs.access(path, function(error) {
                    if (error) {
                        fs.mkdirSync('./public/uploads/' + mssv);
                    }
                })
                newUser.save(function (err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    }
));

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ mssv: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (bcrypt.compareSync(password, user.password)===false) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

module.exports = passport;