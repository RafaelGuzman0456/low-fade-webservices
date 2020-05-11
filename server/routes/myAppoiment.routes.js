const express = require('express');
const router = express.Router();

const myAppoiment = require('../controllers/myAppoiment.controller');

router.get('/:type/:id', myAppoiment.getAppoiments);

module.exports = router;