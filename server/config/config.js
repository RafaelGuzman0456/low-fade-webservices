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

/*
======================
Client ID  Google
======================    
*/
// process.env.CLIENT_ID = process.env.CLIENT_ID || '107102932995-74rljrc677ljmad72fc71e42h8l9dg5n.apps.googleusercontent.com';
process.env.CLIENT_ID = process.env.CLIENT_ID || '334509983882-11s4suufsjmvjm24tbvfsg2qasb8e2ea.apps.googleusercontent.com';

process.env.CLIENT_ID_2 = process.env.CLIENT_ID_2 || '135618941136452';

process.env.CLIENT_SECRET = process.env.CLIENT_SECRET || '6c0b0e6141cb47664bac3fbf60d01fcd';