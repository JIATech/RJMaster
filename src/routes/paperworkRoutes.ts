import { Router } from "express";
import { AppDataSource } from "../adapters/postgres/userRepository";
import { PaperworkService } from "../core/services/paperworkService";
import { Paperwork } from "../core/entities/paperwork";
import { User } from "../core/entities/user";
import { AuditLogService } from "../core/services/auditLogService";
import { AuditLog } from "../core/entities/auditLog";

const router = Router();
const paperworkService = new PaperworkService(
    AppDataSource.getRepository(Paperwork),
    AppDataSource.getRepository(User),
    new AuditLogService(AppDataSource.getRepository(AuditLog))
);

// Crear un papeleo
router.post("/", async (req, res) => {
    try {
        const { description, createdById } = req.body;
        const paperwork = await paperworkService.createPaperwork(description, createdById);
        res.status(201).json(paperwork);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        res.status(400).json({ error: errorMessage });
    }
});

// Actualizar estado de un papeleo
router.put("/:id/status", async (req, res) => {
    try {
        const { status, updatedById } = req.body;
        const { id } = req.params;
        const updatedPaperwork = await paperworkService.updatePaperworkStatus(
            Number(id),
            status,
            updatedById
        );
        res.status(200).json(updatedPaperwork);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        res.status(400).json({ error: errorMessage });
    }
});

// Listar papeleos
router.get("/", async (req, res) => {
    try {
        const paperworks = await paperworkService.listPaperworks();
        res.json(paperworks);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

export default router;
