import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";
import {
  getCarrito,
  agregarItem,
  actualizarItem,
  eliminarItem,
  vaciarCarrito,
} from "../controllers/carrito.controller";
import { validarJWT } from "../middlewares/validar-jwt";

const router = Router();

// Middleware: todos los endpoints requieren autenticación
router.use(validarJWT);

// ✅ Obtener carrito del usuario
router.get("/", getCarrito);

// ✅ Agregar item al carrito
router.post(
  "/items",
  [
    check("productoId", "El ID del producto es obligatorio").not().isEmpty(),
    check("cantidad", "La cantidad debe ser numérica").isNumeric(),
    validarCampos,
  ],
  agregarItem
);

// ✅ Actualizar cantidad de un item
router.put(
  "/items",
  [
    check("productoId", "El ID del producto es obligatorio").not().isEmpty(),
    check("cantidad", "La cantidad debe ser numérica").isNumeric(),
    validarCampos,
  ],
  actualizarItem
);

// ✅ Eliminar item del carrito
router.delete(
  "/items",
  [check("productoId", "El ID del producto es obligatorio").not().isEmpty(), validarCampos],
  eliminarItem
);

// ✅ Vaciar carrito
router.delete("/", vaciarCarrito);

export default router;
