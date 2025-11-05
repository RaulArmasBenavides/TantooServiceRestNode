// src/models/usuario.ts
import { Schema, model, Document } from "mongoose";

export type UserRole = "USER_ROLE" | "ADMIN_ROLE";

export interface IUsuario extends Document {
  nombre: string;
  email: string;
  password: string;
  img?: string;
  role: UserRole;
  google: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UsuarioSchema = new Schema<IUsuario>(
  {
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
    } as any, // (workaround TS para enum string en Schema)
    google: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "usuarios", // opcional: asegura el nombre de colección
  }
);

// Ocultar password y normalizar _id → id en JSON
UsuarioSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
    return ret;
  },
});

// Índice único para email (recomendado asegurar en BD)
UsuarioSchema.index({ email: 1 }, { unique: true });

const Usuario = model<IUsuario>("Usuario", UsuarioSchema);
export default Usuario;
