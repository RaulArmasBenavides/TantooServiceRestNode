"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/project.routes.ts
const express_1 = require("express");
const project_controller_1 = __importDefault(require("../controllers/project.controller"));
const router = (0, express_1.Router)();
// Rutas del proyecto
router.get('/home', project_controller_1.default.home);
router.post('/test', project_controller_1.default.test);
router.post('/saveProject', project_controller_1.default.saveProject);
// Ejemplo de rutas protegidas (si deseas activarlas más adelante)
// router.get("/home", validarJWT, ProjectController.home);
// router.post("/saveProject", [validarJWT, varlidarADMIN_ROLE], ProjectController.saveProject);
exports.default = router;
