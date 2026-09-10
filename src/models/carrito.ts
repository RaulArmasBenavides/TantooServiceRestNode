import { Schema, model, Document, Types } from "mongoose";

interface IItemCarrito {
  producto: Types.ObjectId;
  varianteSku?: string;
  cantidad: number;
  precioUnitario: number;
}

export interface ICarrito extends Document {
  usuario: Types.ObjectId;
  items: IItemCarrito[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ItemCarritoSchema = new Schema<IItemCarrito>(
  {
    producto: {
      type: Schema.Types.ObjectId,
      ref: "Producto",
      required: [true, "El producto es obligatorio"],
    },
    varianteSku: {
      type: String,
    },
    cantidad: {
      type: Number,
      required: [true, "La cantidad es obligatoria"],
      min: [1, "La cantidad debe ser al menos 1"],
    },
    precioUnitario: {
      type: Number,
      required: [true, "El precio unitario es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
  },
  { _id: false }
);

const CarritoSchema = new Schema<ICarrito>(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El usuario es obligatorio"],
      unique: true,
    },
    items: {
      type: [ItemCarritoSchema],
      default: [],
    },
  },
  { timestamps: true, versionKey: false, collection: "carritos" }
);

CarritoSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

CarritoSchema.index({ usuario: 1 }, { unique: true });

const Carrito = model<ICarrito>("Carrito", CarritoSchema);
export default Carrito;
