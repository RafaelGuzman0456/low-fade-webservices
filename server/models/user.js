const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.set('useCreateIndex', true, 'useFindAndModify', false);

const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'EMPLOYEE_ROLE', 'CLIENT_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let userSchema = new Schema({
    id: { type: Number, requiered: true },
    name: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, default: 'CLIENT_ROLE', enum: validRoles },
    description: { type: String, required: false },
    state: { type: Boolean, default: true },
    google: { type: Boolean, default: false },
    facebook: { type: Boolean, default: false },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    created_at: { type: Date, default: Date.now(), required: true }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('User', userSchema);