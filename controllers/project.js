'use strict';
const Project = require('../models/project');

var controller=  
{

    home:function(req,res)
    {
        return res.status(200).send({
            message:'Soy la home'
        });
    },

    test:function(req,res)
    {
        return res.status(200).send({
            message:'Soy el test'
        });
    },
     saveProject:function(req,res)
     { 
         var pro = new Project();
         let params = req.body;
         pro.name = params.name;
         pro.description = params.description;
         pro.category = params.category;
         pro.year = params.year;
         pro.langs = params.langs;
         pro.image = params.image;

         pro.save((err,projectStored) =>{
           
           if(err) return res.status(500).send({message:'Error al guardar documento'});

            return res.status(200).send({project:projectStored});

         });

     }
};

module.exports = controller;