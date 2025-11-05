// src/controllers/usuarios.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Usuario from "../models/usuario";
import { generarJWT } from "../helpers/jwt";

// ✅ Obtener usuarios (paginado)
export const getUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const desde = Number(req.query.desde) || 0;

    const [usuarios, total] = await Promise.all([
      Usuario.find({}, "nombre email role google img").skip(desde).limit(5),
      Usuario.countDocuments(),
    ]);

    res.json({
      ok: true,
      usuarios,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los usuarios",
    });
  }
};

// ✅ Crear usuario
export const crearUsuario = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
      return;
    }

    const usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar usuario
    await usuario.save();

    // Generar token JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

// ✅ Actualizar usuario
export const actualizarUsuario = async (req: Request, res: Response): Promise<void> => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
      return;
    }

    // Excluir campos no editables
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
        return;
      }
    }

    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email !== email) {
      res.status(400).json({
        ok: false,
        msg: "Usuarios de Google no pueden cambiar su correo",
      });
      return;
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

// ✅ Borrar usuario
export const borrarUsuario = async (req: Request, res: Response): Promise<void> => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
      return;
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "Usuario eliminado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
