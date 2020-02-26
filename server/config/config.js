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
Token Expiration
======================    
60 segundos 60 minutos 24 horas 30 dias
*/
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;

/*
======================
Authentication seed
======================    
*/
process.env.SEED = process.env.SEED || 'low-fade';

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