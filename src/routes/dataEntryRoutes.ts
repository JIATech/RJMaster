import { Router } from "express";
import { AppDataSource } from "../adapters/postgres/userRepository";
import { DataEntryService } from "../core/services/dataEntryService";
import { DataEntry } from "../core/entities/dataEntry";
import { User } from "../core/entities/user";
import { AuditLogService } from "../core/services/auditLogService";
import { AuditLog } from "../core/entities/auditLog";

const router = Router();
const dataEntryService = new DataEntryService(
    AppDataSource.getRepository(DataEntry),
    AppDataSource.getRepository(User),
    new AuditLogService(AppDataSource.getRepository(AuditLog))
);

router.post("/", async (req, res) => {
    try {
        const { key, value, userId } = req.body;
        const data = await dataEntryService.addData(key, value, userId);
        res.status(201).json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ error: errorMessage });
    }
});

router.get("/", async (req, res) => {
    try {
        const dataEntries = await dataEntryService.listData();
        res.json(dataEntries);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ error: errorMessage });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { value, userId } = req.body;
        const updatedData = await dataEntryService.updateDataEntry(Number(id), value, userId);
        res.status(200).json(updatedData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ error: errorMessage });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        await dataEntryService.deleteDataEntry(Number(id), userId);
        res.status(204).send();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ error: errorMessage });
    }
});

export default router;
