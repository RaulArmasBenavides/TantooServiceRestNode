import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";
import {
  getCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categorias.controller";
import { validarJWT, varlidarADMIN_ROLE } from "../middlewares/validar-jwt";

const router = Router();

// ✅ Obtener categorías (público)
router.get("/", getCategorias);

// ✅ Crear categoría (admin)
router.post(
  "/",
  [
    validarJWT,
    varlidarADMIN_ROLE,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("slug", "El slug es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// ✅ Actualizar categoría (admin)
router.put(
  "/:id",
  [
    validarJWT,
    varlidarADMIN_ROLE,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

// ✅ Eliminar categoría (admin)
router.delete(
  "/:id",
  [validarJWT, varlidarADMIN_ROLE],
  eliminarCategoria
);

export default router;
