'use strict';
const { dbConnection } = require('./database/config');
let app = require('./app');
let port = 3700;

dbConnection();
// var mongoose = require('mongoose');
// const { dbConnection } = require('./database/config');
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/usuarios')
// .then(()=> { 
//     console.log("Conexión a la base de datos establecida statisfactoriamente");
//creación del servidor 
app.listen(port,()=> {
 console.log("Servidor corriendo correctamente");
});
// }).catch(err => console.log(err));     