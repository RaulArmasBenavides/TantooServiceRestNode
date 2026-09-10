import { Request, Response } from "express";
import Carrito from "../models/carrito";
import Producto from "../models/producto";

export const getCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.uid;

    let carrito = await Carrito.findOne({ usuario: usuarioId }).populate("items.producto");

    if (!carrito) {
      carrito = new Carrito({
        usuario: usuarioId,
        items: [],
      });
      await carrito.save();
      await carrito.populate("items.producto");
    }

    res.json({
      ok: true,
      carrito,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener el carrito",
    });
  }
};

export const agregarItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.uid;
    const { productoId, varianteSku, cantidad } = req.body;

    if (!productoId || !cantidad || cantidad < 1) {
      res.status(400).json({
        ok: false,
        msg: "Datos inválidos",
      });
      return;
    }

    const producto = await Producto.findById(productoId);
    if (!producto) {
      res.status(404).json({
        ok: false,
        msg: "Producto no encontrado",
      });
      return;
    }

    let stockDisponible = producto.stock;

    if (varianteSku && producto.variantes.length > 0) {
      const variante = producto.variantes.find((v) => v.sku === varianteSku);
      if (!variante) {
        res.status(404).json({
          ok: false,
          msg: "Variante no encontrada",
        });
        return;
      }
      stockDisponible = variante.stock;
    }

    if (stockDisponible < cantidad) {
      res.status(400).json({
        ok: false,
        msg: `Stock insuficiente. Disponibles: ${stockDisponible}`,
      });
      return;
    }

    let carrito = await Carrito.findOne({ usuario: usuarioId });

    if (!carrito) {
      carrito = new Carrito({
        usuario: usuarioId,
        items: [],
      });
    }

    const precioUnitario = producto.precioOferta || producto.precio;

    const itemExistente = carrito.items.find(
      (item) =>
        item.producto.toString() === productoId &&
        item.varianteSku === (varianteSku || undefined)
    );

    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      if (stockDisponible < nuevaCantidad) {
        res.status(400).json({
          ok: false,
          msg: `Stock insuficiente. Disponibles: ${stockDisponible}`,
        });
        return;
      }
      itemExistente.cantidad = nuevaCantidad;
    } else {
      carrito.items.push({
        producto: producto._id,
        varianteSku,
        cantidad,
        precioUnitario,
      } as any);
    }

    await carrito.save();
    await carrito.populate("items.producto");

    res.json({
      ok: true,
      carrito,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al agregar item al carrito",
    });
  }
};

export const actualizarItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.uid;
    const { productoId, varianteSku, cantidad } = req.body;

    if (cantidad < 1) {
      res.status(400).json({
        ok: false,
        msg: "La cantidad debe ser al menos 1",
      });
      return;
    }

    const producto = await Producto.findById(productoId);
    if (!producto) {
      res.status(404).json({
        ok: false,
        msg: "Producto no encontrado",
      });
      return;
    }

    let stockDisponible = producto.stock;

    if (varianteSku && producto.variantes.length > 0) {
      const variante = producto.variantes.find((v) => v.sku === varianteSku);
      if (!variante) {
        res.status(404).json({
          ok: false,
          msg: "Variante no encontrada",
        });
        return;
      }
      stockDisponible = variante.stock;
    }

    if (stockDisponible < cantidad) {
      res.status(400).json({
        ok: false,
        msg: `Stock insuficiente. Disponibles: ${stockDisponible}`,
      });
      return;
    }

    const carrito = await Carrito.findOne({ usuario: usuarioId });

    if (!carrito) {
      res.status(404).json({
        ok: false,
        msg: "Carrito no encontrado",
      });
      return;
    }

    const item = carrito.items.find(
      (i) =>
        i.producto.toString() === productoId &&
        i.varianteSku === (varianteSku || undefined)
    );

    if (!item) {
      res.status(404).json({
        ok: false,
        msg: "Item no encontrado en el carrito",
      });
      return;
    }

    item.cantidad = cantidad;

    await carrito.save();
    await carrito.populate("items.producto");

    res.json({
      ok: true,
      carrito,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar item",
    });
  }
};

export const eliminarItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.uid;
    const { productoId, varianteSku } = req.body;

    const carrito = await Carrito.findOne({ usuario: usuarioId });

    if (!carrito) {
      res.status(404).json({
        ok: false,
        msg: "Carrito no encontrado",
      });
      return;
    }

    carrito.items = carrito.items.filter(
      (item) =>
        !(
          item.producto.toString() === productoId &&
          item.varianteSku === (varianteSku || undefined)
        )
    );

    await carrito.save();
    await carrito.populate("items.producto");

    res.json({
      ok: true,
      carrito,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al eliminar item del carrito",
    });
  }
};

export const vaciarCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.uid;

    const carrito = await Carrito.findOne({ usuario: usuarioId });

    if (!carrito) {
      res.status(404).json({
        ok: false,
        msg: "Carrito no encontrado",
      });
      return;
    }

    carrito.items = [];

    await carrito.save();
    await carrito.populate("items.producto");

    res.json({
      ok: true,
      carrito,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al vaciar el carrito",
    });
  }
};
