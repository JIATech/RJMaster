import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "../../core/entities/user";
import { Role } from "../../core/entities/role";
import { Paperwork } from "../../core/entities/paperwork";
import { Client } from "../../core/entities/client";
import { DataEntry } from "../../core/entities/dataEntry";
import { DocumentLog } from "../../core/entities/documentLog";
import { AuditLog } from "../../core/entities/auditLog";


config(); // Carga las variables del archivo .env

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Solo para desarrollo
    logging: true,
    entities: [User, Role, Paperwork, Client, DataEntry, DocumentLog, AuditLog],
});
