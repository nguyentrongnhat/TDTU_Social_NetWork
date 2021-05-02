const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

router.get('/notify/manager', adminController.notifyManager);
router.post('/addUser', adminController.addUser);
router.get('/', adminController.showAdminPage);

module.exports = router;