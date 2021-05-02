const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    google_id: {type: String, default: ''},
    display_name: {type: String, default: ''},
    family_name: {type: String, default: ''},
    email: {type: String, default: ''},
    role: {type: String, deufault: 'student'},
    mssv: {type: String, default: ''},
    password: {type: String},
    avatar_img: {type: String, default: '/images/default_user.png'}
}, {
    timestamps: true
})

module.exports = mongoose.model('User', User);