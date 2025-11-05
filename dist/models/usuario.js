"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/usuario.ts
const mongoose_1 = require("mongoose");
const UsuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true, // crea índice único (no es validador per se)
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "El password es obligatorio"],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        enum: ["USER_ROLE", "ADMIN_ROLE"],
        default: "USER_ROLE",
        required: true,
    }, // (workaround TS para enum string en Schema)
    google: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
    collection: "usuarios", // opcional: asegura el nombre de colección
});
// Ocultar password y normalizar _id → id en JSON
UsuarioSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        return ret;
    },
});
// Índice único para email (recomendado asegurar en BD)
UsuarioSchema.index({ email: 1 }, { unique: true });
const Usuario = (0, mongoose_1.model)("Usuario", UsuarioSchema);
exports.default = Usuario;
