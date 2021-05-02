const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notify = new Schema({
    department: {type: String, default: ''},
    topic: {type: String},
    title: {type: String},
    content: {type: String, default: ''},
}, {
    timestamps: true
})

module.exports = mongoose.model('Notify', Notify);