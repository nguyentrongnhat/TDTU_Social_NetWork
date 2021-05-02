const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

const fileUploader = require('../cloudinary_setup');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/' + req.user.mssv);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage })

router.get('/:id', userController.showUserPage);
router.post('/load/timeline', userController.loadUserPage);
router.post('/edit/displayname', userController.editDisplayName);
router.post('/edit/account', userController.editAccount);
router.post('/edit/avatar', fileUploader.single('image_src'), userController.editAvatar);
router.get('/edit/:id', userController.showEditPage);
router.get('/delete/:id', userController.deleteUser);
module.exports = router;