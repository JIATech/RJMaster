import { Repository } from "typeorm";
import { Paperwork } from "../entities/paperwork";
import { User } from "../entities/user";
import { AuditLogService } from "./auditLogService";

export class PaperworkService {
    constructor(
        private paperworkRepository: Repository<Paperwork>,
        private userRepository: Repository<User>,
        private auditLogService: AuditLogService
    ) { }

    async createPaperwork(description: string, createdById: number): Promise<Paperwork> {
        const user = await this.userRepository.findOne({ where: { id: createdById } });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const paperwork = this.paperworkRepository.create({ description, createdBy: user });
        const savedPaperwork = await this.paperworkRepository.save(paperwork);

        // Registrar auditoría
        await this.auditLogService.logAction(
            "CREATE_PAPERWORK",
            "Paperwork",
            savedPaperwork.id,
            createdById
        );

        return savedPaperwork;
    }

    async updatePaperworkStatus(
        id: number,
        status: "draft" | "in_progress" | "completed",
        updatedById: number
    ): Promise<Paperwork> {
        const user = await this.userRepository.findOne({ where: { id: updatedById } });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const paperwork = await this.paperworkRepository.findOne({ where: { id } });
        if (!paperwork) {
            throw new Error("Papeleo no encontrado");
        }

        paperwork.status = status;
        paperwork.updatedAt = new Date();
        const updatedPaperwork = await this.paperworkRepository.save(paperwork);

        // Registrar auditoría
        await this.auditLogService.logAction(
            "UPDATE_PAPERWORK_STATUS",
            "Paperwork",
            id,
            updatedById
        );

        return updatedPaperwork;
    }

    async listPaperworks(): Promise<Paperwork[]> {
        return this.paperworkRepository.find({ relations: ["createdBy", "approvedBy"] });
    }
}
