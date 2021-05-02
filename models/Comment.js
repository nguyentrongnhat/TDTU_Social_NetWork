const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
    id_author: {type: String},
    id_post: {type: String},
    comment_content: {type: String},
    author_avatar: {type: String, default: ''},
    author_name: {type: String, default: ''}
}, {
    timestamps: true
})

module.exports = mongoose.model('Comment', Comment);