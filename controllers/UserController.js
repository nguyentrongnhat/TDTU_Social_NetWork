const Post = require('../models/Post');
const User = require('../models/User');
const React = require('../models/React');
const Comment = require('../models/Comment');
const { post, unsubscribe } = require('../routes/IndexRoute');

const del = require('del');
const fs = require("fs");
const bcrypt = require('bcrypt');
const saltRounds = 3;

class UserController {
    showUserPage(req, res, next) {
        let user = req.user;
        //console.log(user);
        let user_page_id = req.params.id;
        //console.log('khởi tạo: ', user_page_id)
        User.findOne({ _id: user_page_id })
            .then(page_user => {
                let getPost = Post.find({ id_author: page_user._id.toString() }).sort({ _id: -1 }).limit(10)
                    .then(posts => {
                        ////console.log('post: ', posts)
                        let list_author_id = [];
                        for (var post of posts) {
                            if (list_author_id.includes(post.id_author) === false) {
                                list_author_id.push(post.id_author);
                            }
                        }
                        //console.log(list_author_id)
                        return User.find({ _id: { "$in": list_author_id } })
                            .then(authors => {
                                for (var i = 0; i < posts.length; i++) {
                                    for (var author of authors) {
                                        if (posts[i].id_author === author._id.toString()) {
                                            posts[i].avatar_image_src = author.avatar_img;
                                            posts[i].author = author.display_name;
                                            break;
                                        }
                                    }
                                }
                                return posts;
                            })
                            .then(posts => {

                                let list_post_id = [];
                                for (var post of posts) {
                                    if (list_post_id.includes(post._id.toString()) === false) {
                                        list_post_id.push(post._id.toString());
                                    }
                                }
                                ////console.log(list_post_id);
                                var getReacts = React.find({ post_id: { "$in": list_post_id } })
                                    .then(reacts => reacts);

                                var getComments = Comment.find({ id_post: { "$in": list_post_id } })
                                    .then(comments => comments);

                                Promise.all([getComments, getReacts])
                                    .then(result => {
                                        let comments = result[0];
                                        let reacts = result[1];

                                        ////console.log('comments: ', comments);
                                        ////console.log('reacts: ', reacts)

                                        for (var i = 0; i < posts.length; i++) {
                                            var num_comment = 0;
                                            for (var comment of comments) {
                                                if (posts[i]._id.toString() === comment.id_post) {
                                                    num_comment++;
                                                }
                                            }
                                            ////console.log('num_comment: ', num_comment)
                                            posts[i].comment = num_comment;
                                        }

                                        for (var i = 0; i < posts.length; i++) {
                                            var num_react = 0;
                                            for (var react of reacts) {
                                                if (posts[i]._id.toString() === react.post_id) {
                                                    num_react++;
                                                    if (req.user._id.toString() === react.user_id) {
                                                        posts[i].user_react = user._id.toString();
                                                    }
                                                }
                                            }
                                            ////console.log('num_react: ', num_react)
                                            posts[i].like = num_react;
                                        }
                                        ////console.log(posts);
                                        return res.render('user', { layout: './layouts/onenav_twocol_layout', posts, user, page_user, message: req.flash('message') });
                                    })
                            })
                    })
            });
    }

    loadUserPage(req, res, next) {
        //console.log('vao luon')
        let user = req.user;
        let { skip, page_user_id } = req.body;
        skip = skip * 10;
        let getPost = Post.find({ id_author: page_user_id }).skip(skip).sort({ _id: -1 }).limit(10).
            then(posts => {
                let list_author_id = [];
                for (var post of posts) {
                    if (list_author_id.includes(post.id_author) === false) {
                        list_author_id.push(post.id_author);
                    }
                }
                return User.find({ _id: { "$in": list_author_id } })
                    .then(authors => {
                        for (var i = 0; i < posts.length; i++) {
                            for (var author of authors) {
                                if (posts[i].id_author === author._id.toString()) {
                                    posts[i].avatar_image_src = author.avatar_img;
                                    posts[i].author = author.display_name;
                                }
                            }
                        }
                        return posts;
                    })
                    .then(posts => {

                        let list_post_id = [];
                        for (var post of posts) {
                            if (list_post_id.includes(post._id.toString()) === false) {
                                list_post_id.push(post._id.toString());
                            }
                        }
                        ////console.log(list_post_id);
                        var getReacts = React.find({ post_id: { "$in": list_post_id } })
                            .then(reacts => reacts);

                        var getComments = Comment.find({ id_post: { "$in": list_post_id } })
                            .then(comments => comments);

                        Promise.all([getComments, getReacts])
                            .then(result => {
                                let comments = result[0];
                                let reacts = result[1];

                                ////console.log('comments: ', comments);
                                ////console.log('reacts: ', reacts)

                                for (var i = 0; i < posts.length; i++) {
                                    var num_comment = 0;
                                    for (var comment of comments) {
                                        if (posts[i]._id.toString() === comment.id_post) {
                                            num_comment++;
                                        }
                                    }
                                    ////console.log('num_comment: ', num_comment)
                                    posts[i].comment = num_comment;
                                }

                                for (var i = 0; i < posts.length; i++) {
                                    var num_react = 0;
                                    for (var react of reacts) {
                                        if (posts[i]._id.toString() === react.post_id) {
                                            num_react++;
                                            if (req.user._id.toString() === react.user_id) {
                                                posts[i].user_react = user._id.toString();
                                            }
                                        }
                                    }
                                    ////console.log('num_react: ', num_react)
                                    posts[i].like = num_react;
                                }
                                ////console.log(posts);
                                return res.json({ code: 200, posts, user });
                            })
                    })
            })
    }

    showEditPage(req, res, next) {
        let user = req.user;
        let id = req.params.id;

        if (user.id.toString() === id || user.role === 'Admin') {
            return res.render('edit_user', { layout: './layouts/onenav_layout', id, user });
        }
        return res.redirect('/user/' + user.id.toString());
    }

    editDisplayName(req, res, next) {
        let { display_name, id } = req.body;
        let user = req.user;
        User.findOne({ _id: id })
            .then((edit_user) => {
                edit_user.display_name = display_name;
                edit_user.save();
                if (user._id.toString() === id) {
                    return res.redirect('/user/' + user._id.toString());
                }
                return res.redirect('/admin');
            })
    }

    editAccount(req, res, next) {
        let { current_password, new_password, renew_password, id } = req.body;
        ////console.log(req.body);
        let user = req.user;
        ////console.log(user)
        let path = '/user/edit/' + user._id.toString();
        //console.log(path);
        if (!current_password || !new_password || !renew_password) {
            return res.redirect(path);
        }
        if (bcrypt.compareSync(current_password, user.password) === false) {
            return res.redirect(path);
        }
        if (new_password !== renew_password) {
            return res.redirect(path);
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        let password = bcrypt.hashSync(new_password, salt);
        console.log('passoword: ' + password);
        User.findOne({ _id: id })
            .then((edit_user) => {
                edit_user.password = password;
                edit_user.save();
                if (user._id.toString() === id) {
                    return res.redirect('/user/' + user._id.toString());
                }
                return res.redirect('/admin');
            })
    }

    editAvatar(req, res, next) {
        let user = req.user;
        let { id } = req.body;
        //console.log('id me:', id)
        User.findOne({ _id: id })
            .then((edit_user) => {
                let file = req.file;
                //console.log('file: ', file);
                if (req.file) {
                    let result = req.file.path;
                    console.log(result);
                    edit_user.avatar_img = result;//'/uploads/' + edit_user.mssv + '/' + file.originalname;
                }
                edit_user.save();
                if (user._id.toString() === id) {
                    return res.redirect('/user/' + user._id.toString());
                }
                return res.redirect('/admin');
            })
    }

    deleteUser(req, res) {
        let id = req.params.id;
        User.findOne({ _id: id })
        .then((user) => {
            User.deleteOne({ _id: id })
            .then(() => {
                Comment.deleteMany({id_author: id})
                .then(() => {
                    //console.log("da xoa comment")
                    React.deleteMany({user_id: id})
                    .then(() => {
                        //console.log('da xoa react')
                        Post.deleteMany({id_author: id})
                        .then(() => {
                            //console.log('da xoa post');
                            return res.redirect('/admin')
                        })                       
                    })
                })
            })
        })
    }
}

module.exports = new UserController;