'use strict';
require('dotenv').config();
const cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');

const app = express();
//middlewares 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); //cualquier tipo de petición a json

//CORS 
app.use(cors({
    origin: '*'
}));
//routes
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/project', require('./routes/project') );
module.exports  = app;