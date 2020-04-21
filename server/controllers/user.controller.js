const User = require('../models/user');
const { unlink } = require('fs-extra');
const path = require('path');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const userCtrl = {};
let userPath;

userCtrl.getUsers = async(req, res) => {
    try {
        const users = await User.find({ role: 'EMPLOYEE_ROLE' }, '_id name email description path');
        res.json(users);
    } catch (err) {
        res.status(400).json({
            ok: false,
            err: err
        });
    }
}


userCtrl.getUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id, 'name email description path');
        res.json(user);
    } catch (err) {
        res.status(400).json({
            ok: false,
            err: err
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
            filename: req.file.filename,
            path: '/img/uploads/' + req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
        userPath = user;

        const userDB = await user.save({});
        res.json({
            ok: true,
            user: userDB
        });

    } catch (err) {
        unlink(path.resolve('./libs/public' + userPath.path));
        res.status(400).json({
            ok: false,
            err: err
        });
    }
}

userCtrl.updateUser = async(req, res) => {
    try {
        let id = req.params.id;
        let body = req.body;

        const userDB = await User.findOne({ _id: id });
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        if (req.file) {
            var user = {
                name: body.name,
                description: body.description,
                filename: req.file.filename,
                path: '/img/uploads/' + req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
            unlink(path.resolve('./libs/public' + userDB.path));
        } else {
            var user = {
                name: body.name,
                description: body.description
            }
        }

        await User.updateOne({ _id: id }, { $set: user }, { new: true });
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
}

userCtrl.deleteUser = async(req, res) => {
    try {
        let id = req.params.id;

        const userDeleted = await User.findOneAndDelete({ _id: id });
        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        unlink(path.resolve('./libs/public' + userDeleted.path));
        res.json({
            ok: true,
            user: userDeleted
        });
    } catch (err) {
        return res.status(400).json({
            ok: false,
            err: err
        });
    }
}

module.exports = userCtrl;