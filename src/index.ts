import express from "express";
import userRoutes from "./routes/userRoutes";
import paperworkRoutes from "./routes/paperworkRoutes";
import { AppDataSource } from "./adapters/postgres/userRepository";
import { initializeRoles } from "./core/utils/initializeRoles";
import { Role } from "./core/entities/role";
import clientRoutes from "./routes/clientRoutes";
import auditLogRoutes from "./routes/auditLogRoutes";


const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/users", userRoutes);
app.use("/clients", clientRoutes);
app.use("/paperworks", paperworkRoutes);
app.use("/audit-logs", auditLogRoutes);


AppDataSource.initialize()
    .then(async () => {
        const roleRepository = AppDataSource.getRepository(Role);
        await initializeRoles(roleRepository);
        console.log("Roles inicializados correctamente.");

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.error("Error durante la inicialización:", err));
