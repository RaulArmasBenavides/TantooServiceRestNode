// src/middlewares/validar-jwt.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario';

// 🔹 Extendemos la interfaz Request para permitir `req.uid`
declare global {
  namespace Express {
    interface Request {
      uid?: string;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET no está definido en las variables de entorno');
}

// ✅ Middleware para validar JWT
export const validarJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.log('Validando token...');
  const token = req.header('x-token');

  if (!token) {
    res.status(401).json({
      ok: false,
      msg: 'No hay token en la petición',
    });
    return;
  }

  try {
    const { uid } = jwt.verify(token, JWT_SECRET) as { uid: string };
    req.uid = uid;
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({
      ok: false,
      msg: 'Token no válido',
    });
  }
};

// ✅ Validar si el usuario tiene rol ADMIN
export const varlidarADMIN_ROLE = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const uid = req.uid;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      res.status(404).json({
        ok: false,
        msg: 'Usuario no existe',
      });
      return;
    }

    if (usuarioDB.role !== 'ADMIN_ROLE') {
      res.status(403).json({
        ok: false,
        msg: 'No tiene privilegios para hacer eso',
      });
      return;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

// ✅ Validar si es ADMIN o el mismo usuario
export const varlidarADMIN_ROLE_o_MismoUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      res.status(404).json({
        ok: false,
        msg: 'Usuario no existe',
      });
      return;
    }

    if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
      next();
    } else {
      res.status(403).json({
        ok: false,
        msg: 'No tiene privilegios para hacer eso',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};
