const express = require('express');
const router = express.Router();
const upload = require('../libs/storage');

const { tokenVerification, verifyadministrator_role } = require('../middlewares/authentication');

const userCtrl = require('../controllers/user.controller');

router.get('/', userCtrl.getUsers);
router.get('/:id', [tokenVerification], userCtrl.getUser);
router.post('/', upload, [tokenVerification, verifyadministrator_role], userCtrl.createUser);
router.put('/:id', upload, [tokenVerification, verifyadministrator_role], userCtrl.updateUser);
router.delete('/:id', [tokenVerification, verifyadministrator_role], userCtrl.deleteUser);

module.exports = router;