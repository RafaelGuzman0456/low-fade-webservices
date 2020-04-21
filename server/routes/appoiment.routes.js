const express = require('express');
const router = express.Router();

const appoiment = require('../controllers/appoiment.controller');
router.get('/', appoiment.getAppoiments);
router.post('/', appoiment.createAppoiment);
router.get('/:idDate/:idEmployee', appoiment.getAppoiment);
router.put('/:id', appoiment.editAppoiment);
router.delete('/:id', appoiment.deleteAppoiment);

module.exports = router;