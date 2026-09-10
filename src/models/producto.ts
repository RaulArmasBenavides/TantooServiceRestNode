import { Schema, model, Document, Types } from "mongoose";

interface IVariante {
  atributos: Record<string, string>;
  sku: string;
  precio?: number;
  stock: number;
}

export interface IProducto extends Document {
  nombre: string;
  slug: string;
  descripcion: string;
  categoria: Types.ObjectId;
  marca?: string;
  precio: number;
  precioOferta?: number;
  sku: string;
  imagenes: string[];
  variantes: IVariante[];
  stock: number;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const VarianteSchema = new Schema<IVariante>(
  {
    atributos: {
      type: Map,
      of: String,
      required: true,
    },
    sku: {
      type: String,
      required: [true, "El SKU de la variante es obligatorio"],
    },
    precio: {
      type: Number,
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      default: 0,
    },
  },
  { _id: false }
);

const ProductoSchema = new Schema<IProducto>(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "El slug es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
    },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
      required: [true, "La categoría es obligatoria"],
    },
    marca: {
      type: String,
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    precioOferta: {
      type: Number,
      min: [0, "El precio de oferta no puede ser negativo"],
    },
    sku: {
      type: String,
      required: [true, "El SKU es obligatorio"],
      unique: true,
      uppercase: true,
    },
    imagenes: {
      type: [String],
      default: [],
    },
    variantes: {
      type: [VarianteSchema],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      default: 0,
    },
    activo: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true, versionKey: false, collection: "productos" }
);

ProductoSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

ProductoSchema.index({ slug: 1 }, { unique: true });
ProductoSchema.index({ sku: 1 }, { unique: true });
ProductoSchema.index({ nombre: "text", descripcion: "text" });
ProductoSchema.index({ categoria: 1 });

const Producto = model<IProducto>("Producto", ProductoSchema);
export default Producto;
