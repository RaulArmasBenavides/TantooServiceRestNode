"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = __importDefault(require("../models/project")); // asegúrate que exporte default
const controller = {
    home: (_req, res) => {
        return res.status(200).send({ message: "Soy la home" });
    },
    test: (_req, res) => {
        return res.status(200).send({ message: "Soy el test" });
    },
    saveProject: async (req, res) => {
        try {
            const params = req.body;
            const pro = new project_1.default({
                name: params.name,
                description: params.description,
                category: params.category,
                year: params.year,
                langs: params.langs,
                image: params.image, // si tu schema usa `imagen`, usa: imagen: params.image
            });
            const projectStored = await pro.save();
            return res.status(200).send({ project: projectStored });
        }
        catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Error al guardar documento" });
        }
    },
};
exports.default = controller;
