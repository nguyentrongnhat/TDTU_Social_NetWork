const Post = require('../models/Post');
const User = require('../models/User');
const React = require('../models/React');
const Comment = require('../models/Comment');
const Notify = require('../models/Notify');
const getYouTubeID = require('get-youtube-id');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const { notify } = require('../routes/NotifyRoute');

class IndexController {
    showIndexPage(req, res, next) {
        let user = req.user;
        let getPost = Post.find({}).sort({ _id: -1 }).limit(10)
            .then(posts => {
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
                        //console.log(list_post_id);
                        var getReacts = React.find({ post_id: { "$in": list_post_id } })
                            .then(reacts => reacts);

                        var getComments = Comment.find({ id_post: { "$in": list_post_id } })
                            .then(comments => comments);

                        Promise.all([getComments, getReacts])
                            .then(result => {
                                let comments = result[0];
                                let reacts = result[1];

                                //console.log('comments: ', comments);
                                //console.log('reacts: ', reacts)

                                for (var i = 0; i < posts.length; i++) {
                                    var num_comment = 0;
                                    for (var comment of comments) {
                                        if (posts[i]._id.toString() === comment.id_post) {
                                            num_comment++;
                                        }
                                    }
                                    //console.log('num_comment: ', num_comment)
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
                                    //console.log('num_react: ', num_react)
                                    posts[i].like = num_react;
                                }

                                //console.log(posts);
                            })
                            .then(()=>{
                                Notify.find({}).sort({ _id: -1 }).limit(10)
                                .then(list_notify_side => {
                                    return res.render('index', { layout: './layouts/onenav_twoside_layout', posts, user, message: req.flash('message'), list_notify_side });
                                })
                            })
                    })
            })
    }

    createPost(req, res, next) {
        let user = req.user;
        let baidang = req.body;
        let file = req.file;
        console.log(baidang)
        console.log(file);
        let { id_author, textContent, image_src, video_id } = baidang;
        if (video_id !== '') {
            baidang.video_id = getYouTubeID(video_id);
        }
        console.log('file: ', file);
        baidang.image_src = '';
        if (req.file) {
            baidang.image_src = '/uploads/' + user.mssv + '/' + file.originalname;
        }
       
        let post = new Post(baidang);
        post.save();
        res.json({ post, user });
    }

    editPost(req, res, next) {
        let user = req.user;
        let baidang = req.body;
        console.log('id: ', baidang._id);
        let file = req.file;
        console.log(file);
        if (baidang.video_id !== '') {
            baidang.video_id = getYouTubeID(baidang.video_id);
        }
        console.log('file: ', file);
        baidang.image_src = '';
        if (req.file) {
            baidang.image_src = '/uploads/' + user.mssv + '/' + file.originalname;
        }
        let { id_author, textContent, image_src, video_id } = baidang;
        Post.updateOne({_id: baidang._id}, { textContent, image_src, video_id })
        .then(() => {
            Post.findOne({ _id: baidang._id })
            .then(post => {
                return res.json({post, user});
            });
        });

        //res.json({ post, user });
    }

    getPost(req, res, next) {
        let { post_id } = req.body;
        let user = req.user;
        let getPost = Post.findOne({ _id: post_id })
            .then(post => {
                let author_id = post.id_author;
                return User.findOne({ _id: author_id })
                    .then(author => {
                        post.avatar_image_src = author.avatar_img;
                        post.author = author.display_name;
                        return post;
                    })
                    .then(post => {
                        let post_id = post._id.toString();

                        var getReacts = React.find({ post_id: post_id })
                            .then(reacts => reacts);

                        var getComments = Comment.find({ id_post: post_id })
                            .then(comments => comments);

                        Promise.all([getComments, getReacts])
                            .then(result => {
                                let comments = result[0];
                                let reacts = result[1];

                                var num_comment = 0;
                                for (var comment of comments) {
                                    if (post._id.toString() === comment.id_post) {
                                        num_comment++;
                                    }
                                }
                                post.comment = num_comment;


                                var num_react = 0;
                                for (var react of reacts) {
                                    if (post._id.toString() === react.post_id) {
                                        num_react++;
                                    }
                                    if (user._id.toString() === react.user_id) {
                                        post.user_react = react.user_id;
                                    }
                                }
                                post.like = num_react;

                                return res.json({ code: 200, post, user });
                            })
                    })
            })
    }

    deletePost(req, res, next) {
        let { post_id } = req.body;
        Post.deleteOne({ _id: post_id })
            .then(() => {
                React.deleteMany({post_id: post_id})
                    .then(() => {
                        //console.log('xoa thanh cong react');
                    });
                Comment.deleteMany({ id_post: post_id })
                    .then(() => {
                        //console.log('xoa thanh cong comment');
                    });
                return res.json({ code: 200, post_id });
            })
            .catch(e => console.log(e));
    }

    SignOut(req, res) {
        req.logOut();
        req.session.destroy();
        return res.redirect('/login');
    }

    createReact(req, res) {
        //console.log('create react')
        let r = req.body;
        let react = new React(r);
        react.save();
        res.json({
            message: 'react successfully',
            code: 200
        })
    }

    deleteReact(req, res, next) {
        //console.log('delete react')
        let { user_id, post_id } = req.body;
        React.deleteMany({ 'user_id': user_id, 'post_id': post_id }, (e) => {
            if (e) {
                console.log(e);
            }
            else {
                //console.log('delete successfully');
            }
        });
        res.json({
            message: 'delete react successfully',
            code: 200
        })
    }

    createComment(req, res, next) {
        let { id_author, id_post, comment_content } = req.body;
        let data = req.body;
        let new_comment = new Comment(data);
        new_comment.save();
        res.json({ code: 200, message: 'create comment successfully', new_comment });
    }

    getComment(req, res, next) {
        let user = req.user;
        let { post_id } = req.body;
        //console.log('id_post: ', post_id);
        Comment.find({ id_post: post_id }).sort({ _id: -1 })
            .then(comments => {
                let id_author_list = [];
                for (var cmt of comments) {
                    if (id_author_list.includes(cmt.id_author) === false) {
                        id_author_list.push(cmt.id_author);
                    }
                }
                //console.log('list id: ', id_author_list)
                return User.find({ _id: { "$in": id_author_list } })
                    .then(authors => {
                        //console.log(authors);
                        //console.log('vao vong for: ')
                        for (var i = 0; i < comments.length; i++) {
                            for (var j = 0; j < authors.length; j++) {
                                if (comments[i].id_author === authors[j]._id.toString()) {
                                    comments[i].author_name = authors[j].display_name;
                                    comments[i].author_avatar = authors[j].avatar_img;
                                }
                            }
                        }
                        return comments;
                    })
                    .then(comments => {
                        //console.log('aftercomment: ', comments);
                        return res.json({ code: 200, comments, user });;
                    })
            })
    }

    deleteComment(req, res, next) {
        let { comment_id } = req.body;
        Comment.deleteOne({ _id: comment_id })
            .then(() => {
                return res.json({ code: 200, comment_id });
            })
            .catch(e => console.log(e));
    };

    loadPage(req, res, next) {
        let user = req.user;
        let { skip } = req.body;
        skip = skip * 10;
        let getPost = Post.find({}).skip(skip).sort({ _id: -1 }).limit(10).
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
                        //console.log(list_post_id);
                        var getReacts = React.find({ post_id: { "$in": list_post_id } })
                            .then(reacts => reacts);

                        var getComments = Comment.find({ id_post: { "$in": list_post_id } })
                            .then(comments => comments);

                        Promise.all([getComments, getReacts])
                            .then(result => {
                                let comments = result[0];
                                let reacts = result[1];

                                //console.log('comments: ', comments);
                                //console.log('reacts: ', reacts)

                                for (var i = 0; i < posts.length; i++) {
                                    var num_comment = 0;
                                    for (var comment of comments) {
                                        if (posts[i]._id.toString() === comment.id_post) {
                                            num_comment++;
                                        }
                                    }
                                    //console.log('num_comment: ', num_comment)
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
                                    //console.log('num_react: ', num_react)
                                    posts[i].like = num_react;
                                }
                                //console.log(posts);
                                return res.json({ code: 200, posts, user });
                            })
                    })
            })
    }
}

module.exports = new IndexController;