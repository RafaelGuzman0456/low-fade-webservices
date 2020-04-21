const express = require('express');
const router = express.Router();
const upload = require('../libs/storage');

const { tokenVerification, verifyadministrator_role } = require('../middlewares/authentication');

const userCtrl = require('../controllers/user.controller');

router.get('/', userCtrl.getUsers);
router.get('/:id', userCtrl.getUser);
router.post('/', upload, userCtrl.createUser);
router.put('/:id', upload,  userCtrl.updateUser);
router.delete('/:id',  userCtrl.deleteUser);

module.exports = router;