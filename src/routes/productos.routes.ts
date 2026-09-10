import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";
import {
  getProductos,
  getProductoPorSlug,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productos.controller";
import { validarJWT, varlidarADMIN_ROLE } from "../middlewares/validar-jwt";

const router = Router();

// ✅ Obtener productos (público, con paginación y filtros)
router.get("/", getProductos);

// ✅ Obtener producto por slug (público)
router.get("/:slug", getProductoPorSlug);

// ✅ Crear producto (admin)
router.post(
  "/",
  [
    validarJWT,
    varlidarADMIN_ROLE,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("slug", "El slug es obligatorio").not().isEmpty(),
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    check("categoria", "La categoría es obligatoria").not().isEmpty(),
    check("precio", "El precio es obligatorio").isNumeric(),
    check("sku", "El SKU es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearProducto
);

// ✅ Actualizar producto (admin)
router.put(
  "/:id",
  [
    validarJWT,
    varlidarADMIN_ROLE,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("precio", "El precio debe ser numérico").optional().isNumeric(),
    validarCampos,
  ],
  actualizarProducto
);

// ✅ Eliminar producto (admin)
router.delete(
  "/:id",
  [validarJWT, varlidarADMIN_ROLE],
  eliminarProducto
);

export default router;
