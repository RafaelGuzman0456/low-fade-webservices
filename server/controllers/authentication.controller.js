const User = require('../models/user');


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

var fetch = require('node-fetch');

const authCtrl = {};


authCtrl.login = async(req, res) => {
    try {
        let body = req.body;
        const userDB = await User.findOne({ email: body.email });
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña) incorrectos'
                }
            });
        }

        let token = await jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });
        res.json({
            ok: true,
            user: userDB,
            token
        });


    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
}

// Google Config
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


// Facebook Config
module.exports.getUser = (code) => {
    let appToken;
    let url = 'https://graph.facebook.com/oauth/access_token?client_id=' + process.env.CLIENT_ID_2 + '&client_secret=' + process.env.CLIENT_SECRET + '&grant_type=client_credentials';
    //login as a facebook app to get an "app token"
    return fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(response => {
            appToken = response.access_token;
            //validate "social token", must pass the "app token"
            return fetch('https://graph.facebook.com/debug_token?input_token=' + code.idtoken.authToken + '&access_token=' + appToken, {
                method: 'GET',
            })
        })
        .then(response => response.json())
        .then(response => {
            //check the audience of the token
            const { app_id, is_valid, user_id } = response.data
            if (app_id !== process.env.CLIENT_ID_2) {
                throw new Error('invalid app id: expected [' + process.env.CLIENT_ID_2 + '] but was [' + app_id + ']');
            }
            //check if the token is valid
            if (!is_valid) {
                throw new Error('token is not valid');
            }
            //get user profile using the app token
            return fetch('https://graph.facebook.com/v2.11/' + user_id + '?fields=id,name,picture,email&access_token=' + appToken, {
                method: 'GET',
            })

        })
        .then(response => response.json())
        .then(response => {
            // return the user profile
            const { id, picture, email, name } = response;
            let user = {
                name: name,
                pic: picture.data.url,
                id: id,
                email_verified: true,
                email: email
            }

            return user;
        })
        //throw an error if something goes wrong
        .catch(err => {
            throw new Error("error while authenticating facebook user: " + JSON.stringify(err));
        });


}

authCtrl.google = async(req, res) => {
    try {
        let token = req.body.idtoken;
        let googleUser = await verify(token)
            .catch(e => {
                return res.status(403).json({
                    ok: false,
                    err: e
                });
            });

        const userDB = await User.findOne({ email: googleUser.email });
        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                });
            } else {
                let token = await jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });
                res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else {
            // SI usuario no existe en nuestra bd
            let user = new User({
                name: googleUser.name,
                email: googleUser.email,
                password: 'hola',
                img: googleUser.img,
                google: true
            });

            const userDB = await user.save({});
            let token = await jwt.sign({
                user: userDB
            }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

            res.json({
                ok: true,
                user: userDB,
                token
            });
        }

    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
}

authCtrl.facebook = async(req, res) => {
    try {
        let code = req.body;
        let userFacebook = await this.getUser(code);
        const userDB = await User.findOne({ email: code.idtoken.email });
        if (userDB) {
            if (userDB.facebook === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                });
            } else {
                let token = await jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else {
            // SI usuario no existe en nuestra bd
            let user = new User({
                name: userFacebook.name,
                email: code.idtoken.email,
                password: 'hola',
                img: userFacebook.pic,
                facebook: true
            });

            const userDB = await user.save({});
            let token = await jwt.sign({
                user: userDB
            }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

            res.json({
                ok: true,
                user: userDB,
                token
            });
        }
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }


}




module.exports = authCtrl;