'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = Schema(
    {
        name : String,
        description: String,
        category: String,
        year: String,
        langs: String,
        imagen: String
    }
);

module.exports = mongoose.model('Project',ProjectSchema);


