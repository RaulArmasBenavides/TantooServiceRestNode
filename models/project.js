'use strict'

var mongoose = require('mongoose');
var Schmea = mongoose.Schema;

var ProjectSchema = Schema(
    {
        name : String,
        description: String,
        category: String,
        year:Number
    }
);

module.exports = mongoose.model('Project',ProjectSchema);


