const express = require('express');
const upload = require('../libs/storage');
const router = express.Router();

const service = require('../controllers/service.controller');
router.get('/', service.getServices);
router.post('/', upload, service.createService);
router.get('/:id', service.getService);
router.put('/:id', upload, service.editService); //actualizar
router.delete('/:id', service.deleteService);


module.exports = router;