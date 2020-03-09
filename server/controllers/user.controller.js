const User = require('../models/user');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const userCtrl = {};

userCtrl.getUser = async(req, res) => {
    try {
        const users = await User.find({ role: 'EMPLOYEE_ROLE' }, 'name email description img');
        res.json(users);
    } catch (err) {
        res.status(400).json({
            ok: false,
            err
        });
    }
}

userCtrl.createUser = async(req, res) => {
    try {
        let body = req.body;
        let user = new User({
            name: body.name,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: 'EMPLOYEE_ROLE',
            description: body.description,
            img: body.img
        });

        const userDB = await user.save({});
        res.json({
            ok: true,
            user: userDB
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            err
        });
    }

}

userCtrl.updateUser = async(req, res) => {
    try {
        let id = req.params.id;
        let body = _.pick(req.body, ['name', 'img', 'description']);

        const userDB = await User.findByIdAndUpdate(id, body);
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            err
        });
    }
}

userCtrl.deleteUser = async(req, res) => {
    try {
        let id = req.params.id;

        const userDeleted = await User.deleteOne({ _id: id });
        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            user: userDeleted
        });
    } catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
}

module.exports = userCtrl;