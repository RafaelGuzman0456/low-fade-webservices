const Service = require('../models/service');
const { unlink } = require('fs-extra');
const path = require('path');
const { mongoose } = require('mongoose');
const fs = require('fs');


const serviceController = {};
//CRUD
serviceController.getServices = async(req, res) => {
    const services = await Service.find();
    res.json(services);
}



serviceController.createService = async(req, res) => {
    const service = new Service({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        filename: req.file.filename,
        path: '/img/uploads/' + req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
    });

    await service.save();
    res.json({
        'status': 'servicio guardado'
    });
};

serviceController.getService = async(req, res) => {
    const service = await Service.findById(req.params.id)
    res.json(service);
};


serviceController.editService = async(req, res) => {
    const { id } = req.params;
    if (req.file) {
        var service = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            filename: req.file.filename,
            path: '/img/uploads/' + req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        }
    } else {
        var service = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        }
    }
    const serviceDB = await Service.findOne({ _id: id });

    if (!serviceDB) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Servicio no encontrado'
            }
        });
    }
    unlink(path.resolve('./libs/public' + serviceDB.path));
    await Service.updateOne({ _id: id }, { $set: service }, { new: true });
    res.json({
        ok: true,
        status: 'Service Update'
    });
};

serviceController.deleteService = async(req, res) => {
    const { id } = req.params;
    const serv = await Service.findOneAndDelete({ _id: id });
    unlink(path.resolve('./libs/public' + serv.path));
    res.json({
        'status': req.params.id
    });
}

module.exports = serviceController;