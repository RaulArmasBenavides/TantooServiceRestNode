'use strict';

const {Schema,model} = require('mongoose');
var mongoose = require('mongoose');


var UsuarioSchema = Schema(
    {
        nombre : String,
        email: String,
        password: String,
        img: String,
        role: String,
        google: Boolean
    }
);

//hay un error de validacion , se debe corregir 
// const UsuarioSchema = Schema(
// {
//     nombre: {
//         type: String,
//         required : true
//     },
//     email: {
//         type: String,
//         required : true,
//         unique:true
//     },
//     password: {
//         type:String,
//         required:true
//     },
//     img:{
//         type:String
//     },
//     role:{
//         type:String,
//         required:true,
//         default:'USER_ROLE'
//     },
//     google:{
//         type:Boolean,
//         default:false
//     }
// }

// );

module.exports =model('Usuario',UsuarioSchema);