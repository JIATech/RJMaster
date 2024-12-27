import { Router, Request, Response } from "express";
import { AppDataSource } from "../adapters/postgres/userRepository";
import { ClientService } from "../core/services/clientService";
import { Client } from "../core/entities/client";
import { AuditLogService } from "../core/services/auditLogService";
import { AuditLog } from "../core/entities/auditLog";

const router = Router();
const auditLogService = new AuditLogService(AppDataSource.getRepository(AuditLog));
const clientService = new ClientService(
    AppDataSource.getRepository(Client),
    auditLogService
);

// Crear un cliente
router.post("/", async (req, res) => {
    try {
        const { name, email, phoneNumber, performedById } = req.body;
        const client = await clientService.createClient({ name, email, phoneNumber }, performedById);
        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Actualizar un cliente
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const clientData = req.body;
        const { performedById } = req.body;
        const updatedClient = await clientService.updateClient(Number(id), clientData, performedById);
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Obtener un cliente por ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const client = await clientService.getClientById(Number(id));
        if (!client) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Listar todos los clientes
router.get("/", async (req, res) => {
    try {
        const clients = await clientService.listClients();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;