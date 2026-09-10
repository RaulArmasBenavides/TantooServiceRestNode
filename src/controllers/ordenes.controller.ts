import { Request, Response } from "express";
import Orden from "../models/orden";
import Carrito from "../models/carrito";
import Producto from "../models/producto";

function generarNumeroOrden(): string {
  const now = new Date();
  const fecha = now.toISOString().slice(0, 10).replace(/-/g, "");
  const aleatorio = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${fecha}-${aleatorio}`;
}

export const crearOrden = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.uid;
    const { direccionEnvio, metodo_pago } = req.body;

    if (!direccionEnvio) {
      res.status(400).json({
        ok: false,
        msg: "La dirección de envío es obligatoria",
      });
      return;
    }

    const carrito = await Carrito.findOne({ usuario: usuarioId }).populate("items.producto");

    if (!carrito || carrito.items.length === 0) {
      res.status(400).json({
        ok: false,
        msg: "El carrito está vacío",
      });
      return;
    }

    let subtotal = 0;
    const itemsOrden = [];
    const actualizacionesStock = [];

    for (const item of carrito.items) {
      const producto = await Producto.findById(item.producto);

      if (!producto) {
        res.status(404).json({
          ok: false,
          msg: `Producto ${item.producto} no encontrado`,
        });
        return;
      }

      let stockDisponible = producto.stock;

      if (item.varianteSku && producto.variantes.length > 0) {
        const variante = producto.variantes.find((v) => v.sku === item.varianteSku);
        if (!variante || variante.stock < item.cantidad) {
          res.status(400).json({
            ok: false,
            msg: `Stock insuficiente para ${producto.nombre} (variante: ${item.varianteSku})`,
          });
          return;
        }
        stockDisponible = variante.stock;
      } else if (producto.stock < item.cantidad) {
        res.status(400).json({
          ok: false,
          msg: `Stock insuficiente para ${producto.nombre}`,
        });
        return;
      }

      const precioUnitario = item.precioUnitario;
      const subtotalItem = precioUnitario * item.cantidad;
      subtotal += subtotalItem;

      itemsOrden.push({
        producto: producto._id,
        varianteSku: item.varianteSku,
        nombre: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario,
        subtotal: subtotalItem,
      });

      actualizacionesStock.push({
        productoId: producto._id,
        varianteSku: item.varianteSku,
        cantidad: item.cantidad,
      });
    }

    const impuesto = Math.round(subtotal * 0.18 * 100) / 100;
    const envio = 10;
    const descuento = 0;
    const total = subtotal + impuesto + envio - descuento;

    let ordenCreada = new Orden({
      numeroOrden: generarNumeroOrden(),
      usuario: usuarioId,
      items: itemsOrden,
      subtotal,
      impuesto,
      envio,
      descuento,
      total,
      direccionEnvio,
      estado: "pendiente_pago",
      pago: {
        metodo: metodo_pago || "no_especificado",
        estado: "pendiente",
        monto: total,
      },
      historialTransiciones: [
        {
          estado: "pendiente_pago",
          fecha: new Date(),
          nota: "Orden creada, pendiente de pago",
        },
      ],
    });

    await ordenCreada.save();

    for (const actualizacion of actualizacionesStock) {
      if (actualizacion.varianteSku) {
        await Producto.findByIdAndUpdate(
          actualizacion.productoId,
          {
            $inc: {
              "variantes.$[v].stock": -actualizacion.cantidad,
            },
          },
          { arrayFilters: [{ "v.sku": actualizacion.varianteSku }] }
        );
      } else {
        await Producto.findByIdAndUpdate(actualizacion.productoId, {
          $inc: { stock: -actualizacion.cantidad },
        });
      }
    }

    await Carrito.findByIdAndUpdate(carrito._id, { items: [] });

    await ordenCreada.populate("items.producto");

    res.json({
      ok: true,
      orden: ordenCreada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear la orden",
    });
  }
};

export const getMisOrdenes = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.uid;
    const { page = 0, limit = 10 } = req.query;

    const pageNum = Math.max(0, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = pageNum * limitNum;

    const [ordenes, total] = await Promise.all([
      Orden.find({ usuario: usuarioId })
        .populate("items.producto")
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Orden.countDocuments({ usuario: usuarioId }),
    ]);

    res.json({
      ok: true,
      ordenes,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener las órdenes",
    });
  }
};

export const getOrdenPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const usuarioId = req.uid;

    const orden = await Orden.findById(id).populate("items.producto").populate("usuario", "email nombre");

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
        msg: "No tienes permiso para ver esta orden",
      });
      return;
    }

    res.json({
      ok: true,
      orden,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener la orden",
    });
  }
};

export const cambiarEstadoOrden = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nuevoEstado, nota } = req.body;

    const estadosValidos = [
      "pendiente_pago",
      "pagado",
      "en_preparacion",
      "enviado",
      "entregado",
      "cancelado",
      "reembolsado",
    ];

    if (!estadosValidos.includes(nuevoEstado)) {
      res.status(400).json({
        ok: false,
        msg: `Estado inválido. Estados válidos: ${estadosValidos.join(", ")}`,
      });
      return;
    }

    const orden = await Orden.findById(id);

    if (!orden) {
      res.status(404).json({
        ok: false,
        msg: "Orden no encontrada",
      });
      return;
    }

    orden.estado = nuevoEstado as any;
    orden.historialTransiciones.push({
      estado: nuevoEstado,
      fecha: new Date(),
      usuario: req.uid,
      nota: nota || "",
    });

    await orden.save();

    res.json({
      ok: true,
      orden,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al cambiar el estado de la orden",
    });
  }
};

export const getTodasLasOrdenes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado, page = 0, limit = 10 } = req.query;

    const pageNum = Math.max(0, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = pageNum * limitNum;

    const filtro: Record<string, any> = {};
    if (estado) {
      filtro.estado = estado;
    }

    const [ordenes, total] = await Promise.all([
      Orden.find(filtro)
        .populate("usuario", "nombre email")
        .populate("items.producto")
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Orden.countDocuments(filtro),
    ]);

    res.json({
      ok: true,
      ordenes,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener las órdenes",
    });
  }
};
