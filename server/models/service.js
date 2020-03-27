const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.set('useCreateIndex', true, 'useFindAndModify', false);

const serviceSchema = new Schema({
    id: { type: Number, requiered: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    created_at: { type: Date, default: Date.now(), required: true }
});

module.exports = mongoose.model('Service', serviceSchema);