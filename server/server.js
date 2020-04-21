require('./config/config');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const stripe =require('stripe')('sk_test_gnRYNEVTe3bRdSN3mOV1yPaa00gWoK7qNG');

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


// Routes Angular Client
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/', express.static(path.join(__dirname, '../frontend')));
app.use('/signin', express.static(path.join(__dirname, '../frontend')));
app.use('/home', express.static(path.join(__dirname, '../frontend')));
app.use('/signup', express.static(path.join(__dirname, '../frontend')));
app.use('/profile', express.static(path.join(__dirname, '../frontend')));
app.use('/users', express.static(path.join(__dirname, '../frontend')));
app.use('/users/new', express.static(path.join(__dirname, '../frontend')));
app.use('/user', express.static(path.join(__dirname, '../frontend')));
app.use('/services', express.static(path.join(__dirname, '../frontend')));
app.use('/services/new', express.static(path.join(__dirname, '../frontend')));
app.use('/service', express.static(path.join(__dirname, '../frontend')));

// Routes Node Js
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/login', require('./routes/authentication.routes'));
app.use(require('./routes/authentication.routes'));
app.use(require('./routes/authentication.routes'));
app.use('/api/register', require('./routes/register.routes'));
// Services
app.use('/api/service', require('./routes/service.routes'));
 //Appoiments
app.use('/api/appoiment', require('./routes/appoiment.routes'));
//Clients
app.use('/api/client', require('./routes/client.routes'));
app.use(express.static(path.join(__dirname, 'libs/public')));

// Starting the server
app.listen(process.env.PORT, () => {
    console.log('Server on port: ', process.env.PORT);
});