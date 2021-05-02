const express = require('express');
const router = express.Router();
const notifyController = require('../controllers/NotifyController');

router.get('/manager/:department', notifyController.managerNotify)
router.get('/manager/:department/delete/:id', notifyController.deleteNotify)
router.get('/manager/:department/edit/:id', notifyController.showEditFormNotify)
router.post('/manager/:department/edit/:id', notifyController.editNotify)
router.get('/create', notifyController.showCreateForm)
router.post('/create', notifyController.createNotify)
router.get('/topic', notifyController.notifyTopic)
router.get('/department', notifyController.notifyDepartment)
router.get('/department/:id', notifyController.notifyDepartmentFilter)
router.get('/topic', notifyController.notifyTopic)
router.get('/topic/:topic', notifyController.notifyTopicFilter)
router.get('/detail/:id', notifyController.detailNotify)
router.get('/', notifyController.showNotifyPage)



module.exports = router;