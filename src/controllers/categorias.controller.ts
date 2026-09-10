import { Request, Response } from "express";
import Categoria from "../models/categoria";

export const getCategorias = async (req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await Categoria.find({ activo: true })
      .sort({ orden: 1 })
      .populate("categoriaPadre", "nombre slug");

    res.json({
      ok: true,
      categorias,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener las categorías",
    });
  }
};

export const crearCategoria = async (req: Request, res: Response): Promise<void> => {
  const { nombre, slug, categoriaPadre, orden } = req.body;

  try {
    const existeSlug = await Categoria.findOne({ slug });
    if (existeSlug) {
      res.status(400).json({
        ok: false,
        msg: "Ya existe una categoría con ese slug",
      });
      return;
    }

    const categoria = new Categoria({
      nombre,
      slug: slug.toLowerCase(),
      categoriaPadre: categoriaPadre || null,
      orden: orden || 0,
      activo: true,
    });

    await categoria.save();

    res.json({
      ok: true,
      categoria,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado al crear la categoría",
    });
  }
};

export const actualizarCategoria = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, slug, categoriaPadre, orden, activo } = req.body;

  try {
    const categoriaDB = await Categoria.findById(id);
    if (!categoriaDB) {
      res.status(404).json({
        ok: false,
        msg: "Categoría no encontrada",
      });
      return;
    }

    if (slug && slug !== categoriaDB.slug) {
      const existeSlug = await Categoria.findOne({ slug });
      if (existeSlug) {
        res.status(400).json({
          ok: false,
          msg: "Ya existe una categoría con ese slug",
        });
        return;
      }
    }

    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      id,
      {
        nombre: nombre || categoriaDB.nombre,
        slug: slug ? slug.toLowerCase() : categoriaDB.slug,
        categoriaPadre: categoriaPadre !== undefined ? categoriaPadre : categoriaDB.categoriaPadre,
        orden: orden !== undefined ? orden : categoriaDB.orden,
        activo: activo !== undefined ? activo : categoriaDB.activo,
      },
      { new: true }
    );

    res.json({
      ok: true,
      categoria: categoriaActualizada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar la categoría",
    });
  }
};

export const eliminarCategoria = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const categoriaDB = await Categoria.findById(id);
    if (!categoriaDB) {
      res.status(404).json({
        ok: false,
        msg: "Categoría no encontrada",
      });
      return;
    }

    await Categoria.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Categoría eliminada",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al eliminar la categoría",
    });
  }
};
