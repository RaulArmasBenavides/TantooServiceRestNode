import { Request, Response } from "express";
import Orden from "../models/orden";

/**
 * Controller stub para pagos.
 * Este endpoint simula la confirmación de pago desde un frontend.
 * En producción, debe ser reemplazado por verificación real de webhooks
 * de Niubiz, Culqi u otra pasarela de pago.
 *
 * Punto de integración future:
 * - Verifica firma/autenticación del webhook (HMAC, timestamp)
 * - Valida idempotencia (monta de pago vs monto de orden)
 * - Si válido, marca orden como pagada y crea comprobante
 */

export const confirmarPago = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.uid;
    const { ordenId } = req.body;

    if (!ordenId) {
      res.status(400).json({
        ok: false,
        msg: "El ID de la orden es obligatorio",
      });
      return;
    }

    const orden = await Orden.findById(ordenId);

    if (!orden) {
      res.status(404).json({
        ok: false,
        msg: "Orden no encontrada",
      });
      return;
    }

    if (orden.usuario.toString() !== usuarioId) {
      res.status(403).json({
        ok: false,
        msg: "No tienes permiso para confirmar el pago de esta orden",
      });
      return;
    }

    if (orden.estado !== "pendiente_pago") {
      res.status(400).json({
        ok: false,
        msg: "La orden no está en estado pendiente de pago",
      });
      return;
    }

    // STUB: Aquí iría verificación real de webhook
    // Por ahora, simulamos que el pago se aprobó

    orden.pago.estado = "aprobado";
    orden.pago.referencia = `STUB-${Date.now()}`;
    orden.estado = "pagado";

    orden.historialTransiciones.push({
      estado: "pagado",
      fecha: new Date(),
      nota: "Pago aprobado (stub - verificación real pendiente)",
    });

    await orden.save();

    res.json({
      ok: true,
      orden,
      msg: "Pago confirmado (stub - próximamente integración real)",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al confirmar el pago",
    });
  }
};

/**
 * Webhook de Niubiz (placeholder para integración futura)
 * Debe verificar firma HMAC y procesar eventos de transacción
 */
export const webhookNiubiz = async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Implementar verificación de firma HMAC
    // TODO: Validar timestamp para prevenir replay attacks
    // TODO: Procesar diferentes estados de transacción

    console.log("Webhook Niubiz recibido (stub):", req.body);

    res.json({
      ok: true,
      msg: "Webhook recibido (procesamiento stub)",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error procesando webhook Niubiz",
    });
  }
};

/**
 * Webhook de Culqi (placeholder para integración futura)
 * Debe verificar autenticación y procesar eventos de cargo
 */
export const webhookCulqi = async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Implementar verificación de autenticación Culqi
    // TODO: Procesar diferentes eventos (charge.succeeded, charge.failed, etc.)

    console.log("Webhook Culqi recibido (stub):", req.body);

    res.json({
      ok: true,
      msg: "Webhook recibido (procesamiento stub)",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error procesando webhook Culqi",
    });
  }
};
