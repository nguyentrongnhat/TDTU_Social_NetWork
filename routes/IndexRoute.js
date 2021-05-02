const express = require('express');
const router = express.Router();
const indexController = require('../controllers/IndexController');

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

router.get('/', indexController.showIndexPage);
router.post('/post/create', upload.single('image_src'), indexController.createPost);
router.post('/post/getOne', indexController.getPost);
router.post('/post/delete', indexController.deletePost);
router.post('/post/edit', upload.single('image_src'), indexController.editPost);
router.get('/logout', indexController.SignOut);
router.post('/react/create', indexController.createReact);
router.post('/react/delete', indexController.deleteReact);
router.post('/comment/create', indexController.createComment);
router.post('/comment/delete', indexController.deleteComment);
router.post('/comment/getcomment', indexController.getComment);
router.post('/load/timeline', indexController.loadPage);

module.exports = router;