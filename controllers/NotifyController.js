const Post = require('../models/Post');
const User = require('../models/User');
const React = require('../models/React');
const Comment = require('../models/Comment');
const Notify = require('../models/Notify');
const io = require('../index');

const getYouTubeID = require('get-youtube-id');
const mongoose = require('mongoose');
const socketio = require('socket.io')
const cookieParser = require('cookie-parser');
const { isPlainObject } = require('jquery');

class NotifyController {
    // [get]/notify
    showNotifyPage (req, res) {
        let user =  req.user;
        let getNotify = Notify.find({}).sort({ _id: -1 })
        .then((list_notify)=>{
            Notify.find({}).sort({ _id: -1 }).limit(7)
            .then(list_notify_side => {
                res.render('notify',  { layout: './layouts/onenav_twoside_layout', user, list_notify, list_notify_side });
            })
        })
    }
    
    notifyTopic (req, res) {
        let user =  req.user;
        Notify.find({}).sort({ _id: -1 }).limit(10)
        .then(list_notify_side => {
            return res.render('notify_topic',  { layout: './layouts/onenav_twoside_layout', user, list_notify_side });
        }) 
    }

    notifyTopicFilter(req, res) {
        let user = req.user;
        let topic = req.params.topic;
        Notify.find({topic: topic})
        .then((list_notify)=>{
            //console.log(list_notify)
            Notify.find({}).sort({ _id: -1 }).limit(7)
            .then(list_notify_side => {                
                return res.render('notify', {layout: './layouts/onenav_twoside_layout', user, list_notify, list_notify_side});
            })
        })
    }
        

    notifyDepartment (req, res) {
        let user =  req.user;
        User.find({role: 'Department'})
        .then((departments)=>{
            Notify.find({}).sort({ _id: -1 }).limit(10)
            .then(list_notify_side => {
                return res.render('notify_department',  { layout: './layouts/onenav_twoside_layout', user, departments, list_notify_side });
            })
        })
    }

    notifyDepartmentFilter (req, res) {
        let user =  req.user;
        let id = req.params.id;
        Notify.find({department: id})
        .then((list_notify)=>{
            //console.log(list_notify)
            Notify.find({}).sort({ _id: -1 }).limit(7)
            .then(list_notify_side => {                
                return res.render('notify', {layout: './layouts/onenav_twoside_layout', user, list_notify, list_notify_side});
            })
        })
    }

    showCreateForm (req, res) {
        let user = req.user;
        if(user.role !== 'Department' && user.role !== 'Admin') {
            return res.redirect('/');
        }
        return res.render('create_notify',  { layout: './layouts/onenav_layout', user});
    }

    createNotify (req, res) {
        let user = req.user;
        let {topic, title, content} = req.body;
        let department = user.display_name;
        let notify = new Notify({ department, topic, title, content });
        notify.save();
        io.realtime_notify(department);
        return res.redirect('/notify/manager/' + department);
    }

    detailNotify (req, res) {
        let user = req.user;
        let id = req.params.id;
        Notify.findOne({_id: id})
        .then((notify) => {
            Notify.find({}).sort({ _id: -1 }).limit(7)
            .then(list_notify_side => {
                return res.render('notify_detail', {layout: './layouts/onenav_twoside_layout', user, notify, list_notify_side})
            })
        })
    }

    managerNotify(req, res) {
        let user = req.user;
        let department = req.params.department;
        if(user.display_name === department || user.role === 'Admin') {
            Notify.find({department: department})
            .then(list_notify => {
                return res.render('notify_manager', {layout: './layouts/onenav_layout', department, user, list_notify});
            })
        }
        else {
                return res.redirect('/');
        }
    }

    deleteNotify(req, res) {
        let user = req.user;
        let { id, department } = req.params;
        Notify.deleteOne({_id: id})
        .then(list_notify => {
            return res.redirect('/notify/manager/' + department);
        })
    }

    showEditFormNotify(req, res) {
        let user = req.user;
        let { id, department } = req.params;
        Notify.findOne({_id: id})
        .then(notify => {
            return res.render('edit_notify',  { layout: './layouts/onenav_layout', user, notify, department});
        })
    }

    editNotify(req, res) {
        let user = req.user;
        let { id, department, content, title, topic } = req.body;
        Notify.findOne({_id: id})
        .then(notify => {
            notify.content = content;
            notify.title = title;
            notify.department = department;
            notify.topic = topic;
            notify.save();
            return res.redirect('/notify/manager/' + department);
        })
    }
}

module.exports = new NotifyController;