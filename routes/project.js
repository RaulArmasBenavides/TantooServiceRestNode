'use strict';
var ProjectController = require('../controllers/project');
const { Router } = require('express');
const { 
    validarJWT, 
    varlidarADMIN_ROLE,
    varlidarADMIN_ROLE_o_MismoUsuario
 } = require('../middlewares/validar-jwt');
const router = Router();

 router.get('/home',ProjectController.home);
 router.post('/test',ProjectController.test);
 router.post('/saveProject',ProjectController.saveProject);
module.exports = router;