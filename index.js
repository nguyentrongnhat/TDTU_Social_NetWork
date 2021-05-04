require('dotenv').config();
const PORT = process.env.PORT || 8181;
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const getYouTubeID = require('get-youtube-id');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const socketio = require('socket.io');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

const router = require('./routes/RouteDispatcher');
const db = require('./config/db');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/upload'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/none_layout');

//connect to db
db.connect();

//rout init
router(app);

const httpServer = app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
const io = socketio(httpServer)

module.exports.realtime_notify = function realtime_notify (department) {
    io.sockets.emit('broadcast', `${department} đã đăng thông báo mới`);
};

module.exports.realtime_post = function realtime_post (user_name) {
    io.sockets.emit('broadcast', `${user_name} vừa đăng bài viết mới`);
};