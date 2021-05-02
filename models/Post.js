const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    author: {type: String, default: ''},
    id_author: {type: String},
    textContent: {type: String},
    avatar_image_src: {type: String, default: ''},
    image_src: {type: String, default: ''},
    video_id: {type: String, default: ''},
    like: {type: Number, default: 0},
    comment: {type: Number, default: 0},
    user_react: {type: String, default: ''}
    //createAt: {type: Date, default: Date.now},
    //updateAt: {type: Date, default: Date.now}
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', Post);