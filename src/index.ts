// src/index.ts
import "dotenv/config";
import app from "./app";
import { dbConnection } from "./database/config"; // ajusta la ruta si difiere

const PORT = Number(process.env.PORT ?? 3700);

async function bootstrap() {
  try {
    await dbConnection();
    console.log("Conexión a la base de datos establecida satisfactoriamente");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo correctamente en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error inicializando el servidor:", err);
    process.exit(1);
  }
}

bootstrap();
