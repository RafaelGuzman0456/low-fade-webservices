const mongoose = require('mongoose');


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(db => console.log('Data Base is connected'))
    .catch(err => console.error(err));

module.exports = mongoose;