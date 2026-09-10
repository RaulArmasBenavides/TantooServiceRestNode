import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";
import {
  crearOrden,
  getMisOrdenes,
  getOrdenPorId,
  cambiarEstadoOrden,
  getTodasLasOrdenes,
} from "../controllers/ordenes.controller";
import { validarJWT, varlidarADMIN_ROLE } from "../middlewares/validar-jwt";

const router = Router();

// ✅ Crear orden (autenticado)
router.post(
  "/",
  [
    validarJWT,
    check("direccionEnvio", "La dirección de envío es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  crearOrden
);

// ✅ Obtener mis órdenes (autenticado)
router.get("/mis-ordenes", validarJWT, getMisOrdenes);

// ✅ Obtener orden por ID (autenticado - solo si es dueño)
router.get("/:id", validarJWT, getOrdenPorId);

// ✅ Cambiar estado de orden (admin)
router.put(
  "/:id/estado",
  [
    validarJWT,
    varlidarADMIN_ROLE,
    check("nuevoEstado", "El nuevo estado es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  cambiarEstadoOrden
);

// ✅ Obtener todas las órdenes (admin)
router.get("/", [validarJWT, varlidarADMIN_ROLE], getTodasLasOrdenes);

export default router;
