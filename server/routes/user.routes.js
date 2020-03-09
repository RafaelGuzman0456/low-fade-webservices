const express = require('express');
const router = express.Router();

const { tokenVerification, verifyadministrator_role } = require('../middlewares/authentication');

const userCtrl = require('../controllers/user.controller');

router.get('/', [tokenVerification, verifyadministrator_role], userCtrl.getUser);
router.post('/', [tokenVerification, verifyadministrator_role], userCtrl.createUser);
router.put('/:id', [tokenVerification, verifyadministrator_role], userCtrl.updateUser);
router.delete('/:id', [tokenVerification, verifyadministrator_role], userCtrl.deleteUser);

module.exports = router;