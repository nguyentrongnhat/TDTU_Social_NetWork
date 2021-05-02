const loginRoute = require('./LoginRoute');
const indexRoute = require('./IndexRoute');
const notifyRoute = require('./NotifyRoute');
const adminRoute = require('./AdminRoute');
const userRoute = require('./UserRoute');
const loginController = require('../controllers/LoginController');

const passport = require('../passport_setup')

function RouteDispatcher (app) {
    app.use('/user', loginController.isLoggedIn, userRoute);
    app.use('/admin', loginController.isLoggedIn, loginController.onlyAdmin , adminRoute);
    app.use('/login',loginController.Logged, loginRoute);
    app.use('/notify', loginController.isLoggedIn, notifyRoute);
    app.use('/', loginController.isLoggedIn , indexRoute);
}

module.exports = RouteDispatcher;