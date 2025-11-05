// src/models/project.ts
import { Schema, model, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  category: string;
  year: string; // en tu js original es String
  langs: string;
  imagen?: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    year: { type: String, required: true },
    langs: { type: String, required: true },
    imagen: { type: String },
  },
  {
    versionKey: false,
    // si quieres timestamps, activa:
    // timestamps: true,
  },
);

// Opcional: normalizar _id → id al serializar
ProjectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Project = model<IProject>('Project', ProjectSchema);
export default Project;
