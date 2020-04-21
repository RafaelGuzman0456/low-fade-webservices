const Service = require('../models/service');
const { unlink } = require('fs-extra');
const path = require('path');
const { mongoose } = require('mongoose');
const fs = require('fs');


const serviceController = {};
let servicePath;

serviceController.getServices = async(req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(400).json({
            ok: false,
            err: err
        });
    }
}

serviceController.createService = async(req, res) => {
    try {
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
        servicePath = service;

        await service.save();
        res.json({
            'status': 'servicio guardado'
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            err: err
        });
    }
};

serviceController.getService = async(req, res) => {
    try {
        const service = await Service.findById(req.params.id)
        res.json(service);
    } catch (err) {
        unlink(path.resolve('./libs/public' + servicePath.path));
        res.status(400).json({
            ok: false,
            err: err
        });
    }
};


serviceController.editService = async(req, res) => {
    try {
        const { id } = req.params;

        const serviceDB = await Service.findOne({ _id: id });

        if (!serviceDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Servicio no encontrado'
                }
            });
        }

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
            unlink(path.resolve('./libs/public' + serviceDB.path));
        } else {
            var service = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price
            }
        }
        await Service.updateOne({ _id: id }, { $set: service }, { new: true });
        res.json({
            ok: true,
            status: 'Service Update'
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            err: err
        });
    }
};

serviceController.deleteService = async(req, res) => {
    try {
        const { id } = req.params;
        const serv = await Service.findOneAndDelete({ _id: id });
        unlink(path.resolve('./libs/public' + serv.path));
        res.json({
            'status': req.params.id
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            err: err
        });
    }
}

module.exports = serviceController;