const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const { tokenVerification, verifyadministrator_role } = require('../middlewares/authentication');

const app = express();

app.get('/user', tokenVerification, (req, res) => {

    User.find({}, 'name email role state google img')
        .limit(10)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({}, (err, count) => {

                res.json({
                    ok: true,
                    users,
                    quantity: count
                });
            });
        });
});

app.post('/user', [tokenVerification, verifyadministrator_role], (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        description: body.description
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/user/:id', [tokenVerification, verifyadministrator_role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'img', 'description']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete('/user/:id', [tokenVerification, verifyadministrator_role], (req, res) => {
    let id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

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
    });
});

module.exports = app;