// src/helpers/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET no está definido en las variables de entorno");
}

/**
 * Genera un token JWT firmado con el UID del usuario.
 * @param uid Identificador único del usuario
 * @returns Promise<string> con el token generado
 */
export const generarJWT = (uid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: "12h" },
      (err, token) => {
        if (err || !token) {
          console.error("❌ Error generando JWT:", err);
          reject("No se pudo generar el JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};
