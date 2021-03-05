'use strict'
require("dotenv").config();


const mongoose = require('mongoose');
const app = require('./app');
const port = 3900;




mongoose.set('useFindAndModify', false);
mongoose.set("useCreateIndex", true);





mongoose.Promise = global.Promise;

mongoose.connect(`mongodb+srv://usumamexico:${process.env.mongoPassword}@usumamexicokids.c8tg5.mongodb.net/api_rest_Usuma?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('La conexión a la base de datos correcta!!!');
        //console.log("url is "+window.location.href)

        //Crear servidor y ponerme a escuchar peticiones http
        app.listen(process.env.PORT || port, () => {
            console.log('Servidor corriendo');
        });
    });





// // This is for local storage

// mongoose.connect('mongodb://localhost:27017/api_rest_Usuma', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('La conexión a la base de datos correcta!!!');
//         //console.log("url is "+window.location.href)

//         //Crear servidor y ponerme a escuchar peticiones http
//         app.listen(process.env.PORT || port, () => {
//             console.log('Servidor corriendo');
//             console.log('http://127.0.0.1:' + port)
//         });
//     });