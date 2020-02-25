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
    urlDB = 'mongodb+srv://rafael:rafael123@low-fade-pkoom.mongodb.net/test?retryWrites=true&w=majority';
}
process.env.URLDB = urlDB;