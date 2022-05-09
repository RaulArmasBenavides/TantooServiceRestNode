'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
let project_routes = require('./routes/project');

//middlewares 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); //cualquier tipo de petición a json

//CORS 

//routes
app.use('/api/usuarios/',project_routes);

module.exports  = app;