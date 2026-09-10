import { Schema, model, Document, Types } from "mongoose";

interface IItemOrden {
  producto: Types.ObjectId;
  varianteSku?: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface IDireccionEnvio {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  codigoPostal?: string;
}

interface IPago {
  metodo: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  referencia?: string;
  monto: number;
}

interface ITransicion {
  estado: string;
  fecha: Date;
  usuario?: string;
  nota?: string;
}

export type EstadoOrden =
  | "pendiente_pago"
  | "pagado"
  | "en_preparacion"
  | "enviado"
  | "entregado"
  | "cancelado"
  | "reembolsado";

export interface IOrden extends Document {
  numeroOrden: string;
  usuario: Types.ObjectId;
  items: IItemOrden[];
  subtotal: number;
  impuesto: number;
  envio: number;
  descuento: number;
  total: number;
  direccionEnvio: IDireccionEnvio;
  estado: EstadoOrden;
  pago: IPago;
  historialTransiciones: ITransicion[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ItemOrdenSchema = new Schema<IItemOrden>(
  {
    producto: {
      type: Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    varianteSku: String,
    nombre: {
      type: String,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
    },
    precioUnitario: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const DireccionEnvioSchema = new Schema<IDireccionEnvio>(
  {
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      required: true,
    },
    ciudad: {
      type: String,
      required: true,
    },
    pais: {
      type: String,
      required: true,
    },
    codigoPostal: String,
  },
  { _id: false }
);

const PagoSchema = new Schema<IPago>(
  {
    metodo: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "aprobado", "rechazado"],
      default: "pendiente",
      required: true,
    },
    referencia: String,
    monto: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const TransicionSchema = new Schema<ITransicion>(
  {
    estado: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    usuario: String,
    nota: String,
  },
  { _id: false }
);

const OrdenSchema = new Schema<IOrden>(
  {
    numeroOrden: {
      type: String,
      required: true,
      unique: true,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    items: {
      type: [ItemOrdenSchema],
      required: true,
      default: [],
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    impuesto: {
      type: Number,
      required: true,
      default: 0,
    },
    envio: {
      type: Number,
      required: true,
      default: 0,
    },
    descuento: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    direccionEnvio: {
      type: DireccionEnvioSchema,
      required: true,
    },
    estado: {
      type: String,
      enum: [
        "pendiente_pago",
        "pagado",
        "en_preparacion",
        "enviado",
        "entregado",
        "cancelado",
        "reembolsado",
      ] as const,
      default: "pendiente_pago",
      required: true,
    },
    pago: {
      type: PagoSchema,
      required: true,
    },
    historialTransiciones: {
      type: [TransicionSchema],
      default: [],
    },
  },
  { timestamps: true, versionKey: false, collection: "ordenes" }
);

OrdenSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

OrdenSchema.index({ numeroOrden: 1 }, { unique: true });
OrdenSchema.index({ usuario: 1 });
OrdenSchema.index({ estado: 1 });

const Orden = model<IOrden>("Orden", OrdenSchema);
export default Orden;
