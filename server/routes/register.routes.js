const express = require('express');
const router = express.Router();

const regCtrl = require('../controllers/register.controller');

router.post('/', regCtrl.register);

module.exports = router;