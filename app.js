'use strict'

//Cargar modulos de node para crear servidor
const enforce = require('express-sslify');
var express = require('express');
var bodyParser = require('body-parser');
var path = require("path")
const ejs = require("ejs");


//Ejecutar express (http)
var app = express();

//Cargar ficheros rutas

const kids_routes = require('./routes/kids');

const admin_routes = require('./routes/admin');


//ADMIN session

const session = require('express-session')
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//Middlewares


//This one turn it off in local host
app.use(enforce.HTTPS({ trustProtoHeader: true }));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.set("view engine", "ejs");



app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

app.use(passport.session());


// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Añadir prefijos a rutas / cargar rutas

app.use(kids_routes);
app.use(admin_routes);
app.use(function(req, res, next) {
    res.status(404).render("error", { code: "404", message: "No pudimos encontrar la página que estas buscando" });
});




//Exportar modulo(fichero actual)

module.exports = app;