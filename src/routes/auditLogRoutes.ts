import { Router } from "express";
import { AppDataSource } from "../adapters/postgres/userRepository";
import { AuditLogService } from "../core/services/auditLogService";
import { AuditLog } from "../core/entities/auditLog";

const router = Router();
const auditLogService = new AuditLogService(AppDataSource.getRepository(AuditLog));

// Listar registros de auditoría con filtros
router.get("/", async (req, res) => {
    try {
        const { action, entity, performedById, startDate, endDate } = req.query;

        const logs = await auditLogService.listLogs({
            action: action as string,
            entity: entity as string,
            performedById: performedById ? Number(performedById) : undefined,
            startDate: startDate as string,
            endDate: endDate as string,
        });

        res.json(logs);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

export default router;
