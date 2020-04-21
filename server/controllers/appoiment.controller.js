const Appoiment = require('../models/appoiment');
const Service = require('../models/service');
const User = require('../models/user');
const path = require('path');
const { mongoose } = require('mongoose');
const stripe = require('stripe')('sk_test_FDcpDLZRDn3VSgS3lKVMgah800RcnSqvFC');
const userCtrl = require('../controllers/user.controller');


const appoimentController = {};

appoimentController.getAppoiments = async(req, res) => {
    await Appoiment.find({}, function(err, appoiments) {
        Service.populate(appoiments, { path: "" }, function(err, appoiments) {
            res.status(200).send(appoiments);
        });
    });
}


appoimentController.createAppoiment = async(req, res) => {
    try {
        const clientObject = await User.findById(req.body.clientId);
        if (!clientObject) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The client does not exist'
                }
            });
        }
        const serviceObject = await Service.findById(req.body.serviceId);
        if (!serviceObject) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The service does not exist'
                }
            });
        }
        //Apppoiment
        const verifyAppoit = await Appoiment.findOne({
            employeeId: req.body.employeeId,
            dateTime: req.body.dateTime,
            hour: req.body.hour
        });
        if (verifyAppoit) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'appoiment its already created'
                }
            });
        }
        const appoiment = new Appoiment({
            employeeId: req.body.employeeId,
            clientId: req.body.clientId,
            serviceId: req.body.serviceId,
            dateTime: req.body.dateTime,
            hour: req.body.hour
        });

        //create customer
        const customer = await stripe.customers.create({
            email: clientObject.email,
            source: req.body.pay.id
        });

        //function to create checkbox
        const serviceAmount = (serviceObject.price) * (100); // conversion to mexican price to penny
        if (serviceAmount >= 80000) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The cost of the service is expensive.'
                }
            });
        }

        const charge = await stripe.charges.create({
            amount: serviceAmount,
            currency: 'mxn',
            customer: customer.id,
            description: serviceObject.name,
        });

        if (charge) {
            await appoiment.save(); // se guarda la cita
            res.json({
                'status': 'Successful appointment'
            });
        } else {
            res.json({
                'status': 'purchase rejected'
            });
        }
    } catch (err) {
        res.status(400).json({
            ok: false,
            err
        });
    }
}

appoimentController.getAppoiment = async(req, res) => {
    const appoiment = await Appoiment.find({ dateTime: req.params.idDate, employeeId: req.params.idEmployee }, 'hour');
    //const appoiment = await Appoiment.findById(req.params.id);
    res.json(appoiment);
}


appoimentController.editAppoiment = async(req, res) => {
    const { id } = req.params;
    const appoiment = {
        clientId: req.body.clientId,
        serviceId: req.body.serviceId,
        date: req.body.date,
    }
    await Appoiment.findByIdAndUpdate(id, { $set: appoiment }, { new: true });

    res.json({ 'status': 'Appoiment u pdate' });
};

appoimentController.deleteAppoiment = async(req, res) => {

    const { id } = req.params;
    await Appoiment.findByIdAndDelete(id);

    res.json({
        'status': 'Appoiment ' + id + ' deleted'
    })
}

module.exports = appoimentController;