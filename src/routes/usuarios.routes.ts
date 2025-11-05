// src/routes/usuarios.routes.ts
import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlewares/validar-campos';
import {
  getUsuarios,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
} from '../controllers/usuarios.controller';
import {
  validarJWT,
  varlidarADMIN_ROLE,
  varlidarADMIN_ROLE_o_MismoUsuario,
} from '../middlewares/validar-jwt';

const router = Router();

/**
 * Ruta base: /api/usuarios
 */

// ✅ Obtener usuarios (requiere token)
router.get('/', validarJWT, getUsuarios);

// ✅ Crear usuario
router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,
  ],
  crearUsuario,
);

// ✅ Actualizar usuario
router.put(
  '/:id',
  [
    validarJWT,
    varlidarADMIN_ROLE_o_MismoUsuario,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario,
);

// ✅ Borrar usuario
router.delete('/:id', [validarJWT, varlidarADMIN_ROLE], borrarUsuario);

export default router;
