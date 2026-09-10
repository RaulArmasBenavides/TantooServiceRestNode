import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";
import { confirmarPago, webhookNiubiz, webhookCulqi } from "../controllers/pagos.controller";
import { validarJWT } from "../middlewares/validar-jwt";

const router = Router();

// ✅ Confirmar pago (autenticado) - STUB para MVP
router.post(
  "/confirmar",
  [
    validarJWT,
    check("ordenId", "El ID de la orden es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  confirmarPago
);

// ✅ Webhook Niubiz (sin autenticación, pero debe verificar firma en producción)
router.post("/webhook/niubiz", webhookNiubiz);

// ✅ Webhook Culqi (sin autenticación, pero debe verificar firma en producción)
router.post("/webhook/culqi", webhookCulqi);

export default router;
