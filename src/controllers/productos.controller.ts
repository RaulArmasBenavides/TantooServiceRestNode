import { Request, Response } from "express";
import Producto from "../models/producto";
import Categoria from "../models/categoria";

export const getProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria, q, page = 0, limit = 10 } = req.query;
    const pageNum = Math.max(0, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = pageNum * limitNum;

    const filtro: Record<string, any> = { activo: true };

    if (categoria) {
      filtro.categoria = categoria;
    }

    if (q) {
      filtro.$text = { $search: String(q) };
    }

    const [productos, total] = await Promise.all([
      Producto.find(filtro)
        .populate("categoria", "nombre slug")
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Producto.countDocuments(filtro),
    ]);

    res.json({
      ok: true,
      productos,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los productos",
    });
  }
};

export const getProductoPorSlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  try {
    const producto = await Producto.findOne({ slug, activo: true }).populate("categoria");

    if (!producto) {
      res.status(404).json({
        ok: false,
        msg: "Producto no encontrado",
      });
      return;
    }

    res.json({
      ok: true,
      producto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener el producto",
    });
  }
};

export const crearProducto = async (req: Request, res: Response): Promise<void> => {
  const { nombre, slug, descripcion, categoria, marca, precio, precioOferta, sku, imagenes, variantes, stock } =
    req.body;

  try {
    const existeSlug = await Producto.findOne({ slug: slug?.toLowerCase() });
    if (existeSlug) {
      res.status(400).json({
        ok: false,
        msg: "Ya existe un producto con ese slug",
      });
      return;
    }

    const existeSku = await Producto.findOne({ sku: sku?.toUpperCase() });
    if (existeSku) {
      res.status(400).json({
        ok: false,
        msg: "Ya existe un producto con ese SKU",
      });
      return;
    }

    const categoriaDB = await Categoria.findById(categoria);
    if (!categoriaDB) {
      res.status(400).json({
        ok: false,
        msg: "La categoría no existe",
      });
      return;
    }

    const producto = new Producto({
      nombre,
      slug: slug?.toLowerCase(),
      descripcion,
      categoria,
      marca,
      precio,
      precioOferta,
      sku: sku?.toUpperCase(),
      imagenes: imagenes || [],
      variantes: variantes || [],
      stock: stock || 0,
      activo: true,
    });

    await producto.save();
    await producto.populate("categoria", "nombre slug");

    res.json({
      ok: true,
      producto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear el producto",
    });
  }
};

export const actualizarProducto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, slug, descripcion, categoria, marca, precio, precioOferta, sku, imagenes, variantes, stock, activo } =
    req.body;

  try {
    const productoDB = await Producto.findById(id);
    if (!productoDB) {
      res.status(404).json({
        ok: false,
        msg: "Producto no encontrado",
      });
      return;
    }

    if (slug && slug !== productoDB.slug) {
      const existeSlug = await Producto.findOne({ slug: slug.toLowerCase() });
      if (existeSlug) {
        res.status(400).json({
          ok: false,
          msg: "Ya existe un producto con ese slug",
        });
        return;
      }
    }

    if (sku && sku !== productoDB.sku) {
      const existeSku = await Producto.findOne({ sku: sku.toUpperCase() });
      if (existeSku) {
        res.status(400).json({
          ok: false,
          msg: "Ya existe un producto con ese SKU",
        });
        return;
      }
    }

    if (categoria && categoria !== productoDB.categoria.toString()) {
      const categoriaDB = await Categoria.findById(categoria);
      if (!categoriaDB) {
        res.status(400).json({
          ok: false,
          msg: "La categoría no existe",
        });
        return;
      }
    }

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      {
        nombre: nombre || productoDB.nombre,
        slug: slug ? slug.toLowerCase() : productoDB.slug,
        descripcion: descripcion || productoDB.descripcion,
        categoria: categoria || productoDB.categoria,
        marca: marca !== undefined ? marca : productoDB.marca,
        precio: precio !== undefined ? precio : productoDB.precio,
        precioOferta: precioOferta !== undefined ? precioOferta : productoDB.precioOferta,
        sku: sku ? sku.toUpperCase() : productoDB.sku,
        imagenes: imagenes || productoDB.imagenes,
        variantes: variantes || productoDB.variantes,
        stock: stock !== undefined ? stock : productoDB.stock,
        activo: activo !== undefined ? activo : productoDB.activo,
      },
      { new: true }
    ).populate("categoria", "nombre slug");

    res.json({
      ok: true,
      producto: productoActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar el producto",
    });
  }
};

export const eliminarProducto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const productoDB = await Producto.findById(id);
    if (!productoDB) {
      res.status(404).json({
        ok: false,
        msg: "Producto no encontrado",
      });
      return;
    }

    await Producto.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Producto eliminado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al eliminar el producto",
    });
  }
};
