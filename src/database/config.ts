// src/database/config.ts
import mongoose from "mongoose";

export const dbConnection = async (): Promise<void> => {
  try {
    const uri = process.env.DB_CNN2;

    if (!uri) {
      throw new Error("❌ Variable de entorno DB_CNN2 no definida");
    }

    await mongoose.connect(uri, {
      // Los flags ya no son necesarios en Mongoose 6+, pero puedes dejarlos:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log("✅ DB Online");
  } catch (error) {
    console.error("❌ Error al iniciar la BD:", error);
    throw new Error("Error a la hora de iniciar la BD. Ver logs.");
  }
};
