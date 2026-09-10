import { Schema, model, Document, Types } from "mongoose";

export interface ICategoria extends Document {
  nombre: string;
  slug: string;
  categoriaPadre?: Types.ObjectId | null;
  activo: boolean;
  orden: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategoriaSchema = new Schema<ICategoria>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la categoría es obligatorio"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "El slug es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    categoriaPadre: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
      default: null,
    },
    activo: {
      type: Boolean,
      default: true,
      required: true,
    },
    orden: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true, versionKey: false, collection: "categorias" }
);

CategoriaSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

CategoriaSchema.index({ slug: 1 }, { unique: true });

const Categoria = model<ICategoria>("Categoria", CategoriaSchema);
export default Categoria;
