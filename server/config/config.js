/*
======================
        Port
======================    
*/
process.env.PORT = process.env.PORT || 3000;

/*
======================
Environment
======================    
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*
======================
DataBase
======================    
*/
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/low-fade';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;