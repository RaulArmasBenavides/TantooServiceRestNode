// src/controllers/project.controller.ts
import { Request, Response } from "express";
import Project from "../models/project"; // asegúrate que exporte default

const controller = {
  home: (_req: Request, res: Response) => {
    return res.status(200).send({ message: "Soy la home" });
  },

  test: (_req: Request, res: Response) => {
    return res.status(200).send({ message: "Soy el test" });
  },

  saveProject: async (req: Request, res: Response) => {
    try {
      const params = req.body as {
        name?: string;
        description?: string;
        category?: string;
        year?: string | number;
        langs?: string;
        image?: string; // si tu modelo usa `imagen`, cambia a `imagen?: string`
      };

      const pro = new Project({
        name: params.name,
        description: params.description,
        category: params.category,
        year: params.year,
        langs: params.langs,
        image: params.image, // si tu schema usa `imagen`, usa: imagen: params.image
      });

      const projectStored = await pro.save();
      return res.status(200).send({ project: projectStored });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Error al guardar documento" });
    }
  },
};

export default controller;
