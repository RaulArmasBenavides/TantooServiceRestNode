// src/routes/project.routes.ts
import { Router } from 'express';
import ProjectController from '../controllers/project.controller';

const router = Router();

// Rutas del proyecto
router.get('/home', ProjectController.home);
router.post('/test', ProjectController.test);
router.post('/saveProject', ProjectController.saveProject);

// Ejemplo de rutas protegidas (si deseas activarlas más adelante)
// router.get("/home", validarJWT, ProjectController.home);
// router.post("/saveProject", [validarJWT, varlidarADMIN_ROLE], ProjectController.saveProject);

export default router;
