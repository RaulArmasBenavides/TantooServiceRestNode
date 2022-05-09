'use strict';
var express = require('express');
var ProjectController = require('../controllers/project');
var router = express.Router();

// router.get('/home',ProjectController.home);
// router.post('/test',ProjectController.test);
// router.post('/saveProject',ProjectController.saveProject);
router.post('/crearUsuario',ProjectController.crearUsuario);
module.exports = router;