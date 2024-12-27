import { Repository } from "typeorm";
import { DocumentLog } from "../entities/documentLog";
import { User } from "../entities/user";

export class DocumentLogService {
    constructor(
        private documentLogRepository: Repository<DocumentLog>,
        private userRepository: Repository<User>
    ) { }

    async logDocument(documentType: string, userId: number): Promise<DocumentLog> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const documentLog = this.documentLogRepository.create({
            documentType,
            generatedBy: user,
        });
        return this.documentLogRepository.save(documentLog);
    }

    async listLogs(): Promise<DocumentLog[]> {
        return this.documentLogRepository.find({ relations: ["generatedBy"] });
    }
}
