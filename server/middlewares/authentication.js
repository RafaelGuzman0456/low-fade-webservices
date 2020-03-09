const jwt = require('jsonwebtoken');

/*
Token Verification
*/
let tokenVerification = (req, res, next) => {
    var token;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        token = bearerToken;
    } else {
        res.send(403);
    }

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
};


let verifyadministrator_role = (req, res, next) => {

    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}

let verifyemployee_role = (req, res, next) => {
    let user = req.user;

    if (user.role === 'EMPLOYEE_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es Empleado'
            }
        });
    }
}

module.exports = {
    tokenVerification,
    verifyadministrator_role,
    verifyemployee_role
}