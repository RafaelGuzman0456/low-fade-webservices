const Appoiment = require('../models/appoiment');

const myAppoimentController = {};

myAppoimentController.getAppoiments = async(req, res) => {
    console.log(req.params);
    if (req.params.type === "barber") {
        const appoiment = await Appoiment.find({ employeeId: req.params.id }).
        populate('serviceId clientId');
        res.json(appoiment);
    } else if (req.params.type === "client") {
        const appoiment = await Appoiment.find({ clientId: req.params.id }).
        populate('serviceId employeeId');
        res.json(appoiment);
    }
}

module.exports = myAppoimentController;