"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
// src/database/config.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnection = async () => {
    try {
        const uri = process.env.DB_CNN2;
        if (!uri) {
            throw new Error("❌ Variable de entorno DB_CNN2 no definida");
        }
        await mongoose_1.default.connect(uri, {
        // Los flags ya no son necesarios en Mongoose 6+, pero puedes dejarlos:
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        });
        console.log("✅ DB Online");
    }
    catch (error) {
        console.error("❌ Error al iniciar la BD:", error);
        throw new Error("Error a la hora de iniciar la BD. Ver logs.");
    }
};
exports.dbConnection = dbConnection;
