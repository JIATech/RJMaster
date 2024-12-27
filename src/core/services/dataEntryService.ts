import { Repository } from "typeorm";
import { DataEntry } from "../entities/dataEntry";
import { User } from "../entities/user";
import { AuditLogService } from "./auditLogService";

export class DataEntryService {
    constructor(
        private dataEntryRepository: Repository<DataEntry>,
        private userRepository: Repository<User>,
        private auditLogService: AuditLogService
    ) { }

    async addData(key: string, value: string, userId: number): Promise<DataEntry> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const dataEntry = this.dataEntryRepository.create({ key, value, addedBy: user });
        const savedDataEntry = await this.dataEntryRepository.save(dataEntry);

        // Registrar auditoría
        await this.auditLogService.logAction(
            "ADD_DATA_ENTRY",
            "DataEntry",
            savedDataEntry.id,
            userId
        );

        return savedDataEntry;
    }

    async listData(): Promise<DataEntry[]> {
        return this.dataEntryRepository.find({ relations: ["addedBy", "client"] });
    }

    async updateDataEntry(
        id: number,
        newValue: string,
        userId: number
    ): Promise<DataEntry> {
        const dataEntry = await this.dataEntryRepository.findOne({ where: { id } });
        if (!dataEntry) {
            throw new Error("DataEntry no encontrado");
        }

        dataEntry.value = newValue;
        const updatedDataEntry = await this.dataEntryRepository.save(dataEntry);

        // Registrar auditoría
        await this.auditLogService.logAction(
            "UPDATE_DATA_ENTRY",
            "DataEntry",
            id,
            userId
        );

        return updatedDataEntry;
    }

    async deleteDataEntry(id: number, userId: number): Promise<void> {
        const dataEntry = await this.dataEntryRepository.findOne({ where: { id } });
        if (!dataEntry) {
            throw new Error("DataEntry no encontrado");
        }

        await this.dataEntryRepository.remove(dataEntry);

        // Registrar auditoría
        await this.auditLogService.logAction(
            "DELETE_DATA_ENTRY",
            "DataEntry",
            id,
            userId
        );
    }
}
