require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


const { mongoose } = require('./database');


// Routes
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/login', require('./routes/authentication.routes'));
app.use(require('./routes/authentication.routes'));
app.use(require('./routes/authentication.routes'));
app.use('/api/register', require('./routes/register.routes'));

// Starting the server
app.listen(process.env.PORT, () => {
    console.log('Server on port: ', process.env.PORT);
});