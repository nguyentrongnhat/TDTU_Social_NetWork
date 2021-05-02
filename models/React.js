const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const React = new Schema({
    user_id: {type: String},
    post_id: {type: String},
    //createAt: {type: Date, default: Date.now},
    //updateAt: {type: Date, default: Date.now}
}, {
    timestamps: true
})

module.exports = mongoose.model('React', React);