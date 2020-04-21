const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const regCtrl = {};

regCtrl.register = async(req, res) => {
    try {
        let body = req.body;
        const userDB = await User.findOne({ email: body.email });
        if (userDB) {
            console.log("1");
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Correo ya registrado'
                }
            });
        }
        let user = new User({
            name: body.name,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: 'CLIENT_ROLE',
            birthday: Date.now(),
            premiumClient: false
        });
        const userSave = await user.save({});
        let token = await jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });
        res.json({
            ok: true,
            user: userSave,
            token
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            err
        });
    }
}



module.exports = regCtrl;