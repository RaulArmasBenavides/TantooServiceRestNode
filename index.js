'use strict'
var mongoose = require('mongoose');
let app = require('./app');
let port = 3700;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/portafolio')
.then(()=> { console.log("Conexión a la base de datos establecida statisfactoriamente");
//creación del servidor 
app.listen(port,()=> {
 console.log("Servidor corriendo correctamente");
});
}).catch(err => console.log(err));     