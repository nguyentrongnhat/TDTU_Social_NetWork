const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    google_id: {type: String, default: ''},
    display_name: {type: String, default: ''},
    family_name: {type: String, default: ''},
    email: {type: String, default: ''},
    role: {type: String, deufault: 'Student'},
    mssv: {type: String, default: ''},
    password: {type: String},
    avatar_img: {type: String, default: 'https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png'}
}, {
    timestamps: true
})

module.exports = mongoose.model('User', User);