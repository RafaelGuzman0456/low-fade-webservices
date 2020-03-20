const express = require('express');
const router = express.Router();

const { tokenVerification } = require('../middlewares/authentication');


const authCtrl = require('../controllers/authentication.controller');


router.post('/', authCtrl.login);
router.post('/api/google', authCtrl.google);
router.post('/api/facebook', authCtrl.facebook);


module.exports = router;