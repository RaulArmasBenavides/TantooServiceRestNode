"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/usuarios.routes.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
const usuarios_controller_1 = require("../controllers/usuarios.controller");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const router = (0, express_1.Router)();
/**
 * Ruta base: /api/usuarios
 */
// ✅ Obtener usuarios (requiere token)
router.get('/', validar_jwt_1.validarJWT, usuarios_controller_1.getUsuarios);
// ✅ Crear usuario
router.post('/', [
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('password', 'El password es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
    validar_campos_1.validarCampos,
], usuarios_controller_1.crearUsuario);
// ✅ Actualizar usuario
router.put('/:id', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.varlidarADMIN_ROLE_o_MismoUsuario,
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El email es obligatorio').isEmail(),
    (0, express_validator_1.check)('role', 'El role es obligatorio').not().isEmpty(),
    validar_campos_1.validarCampos,
], usuarios_controller_1.actualizarUsuario);
// ✅ Borrar usuario
router.delete('/:id', [validar_jwt_1.validarJWT, validar_jwt_1.varlidarADMIN_ROLE], usuarios_controller_1.borrarUsuario);
exports.default = router;
