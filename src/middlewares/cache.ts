// src/middlewares/cache.ts
import getExpeditiousCache, { ExpeditiousOptions } from 'express-expeditious';

// ⚙️ Configuración por defecto del caché
const defaultOptions: ExpeditiousOptions = {
  namespace: 'expresscache',
  defaultTtl: '15 minutes', // También puedes usar: 15 * 60 * 1000
  statusCodeExpires: {
    404: '5 minutes',
    500: 0, // No cachea errores de servidor
  },
};

// 🧩 Inicializa el middleware de caché
export const cacheInit = getExpeditiousCache(defaultOptions);

export default { cacheInit };
