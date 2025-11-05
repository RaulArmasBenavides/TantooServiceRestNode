"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/project.ts
const mongoose_1 = require("mongoose");
const ProjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    year: { type: String, required: true },
    langs: { type: String, required: true },
    imagen: { type: String },
}, {
    versionKey: false,
    // si quieres timestamps, activa:
    // timestamps: true,
});
// Opcional: normalizar _id → id al serializar
ProjectSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    },
});
const Project = (0, mongoose_1.model)('Project', ProjectSchema);
exports.default = Project;
