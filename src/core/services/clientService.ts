import { Repository } from "typeorm";
import { AuditLogService } from "./auditLogService";
import { Client } from "../entities/client";

export class ClientService {
    constructor(
        private clientRepository: Repository<Client>,
        private auditLogService: AuditLogService
    ) { }

    async createClient(clientData: Partial<Client>, performedById: number): Promise<Client> {
        if (!clientData.name) {
            throw new Error("El nombre del cliente es obligatorio");
        }

        const client = this.clientRepository.create(clientData);
        const savedClient = await this.clientRepository.save(client);

        // Registrar auditoría
        await this.auditLogService.logAction(
            "CREATE_CLIENT",
            "Client",
            savedClient.id,
            performedById
        );

        return savedClient;
    }

    async updateClient(id: number, clientData: Partial<Client>, performedById: number): Promise<Client> {
        const client = await this.clientRepository.findOne({ where: { id } });
        if (!client) {
            throw new Error("Cliente no encontrado");
        }

        Object.assign(client, clientData);
        const updatedClient = await this.clientRepository.save(client);

        // Registrar auditoría
        await this.auditLogService.logAction(
            "UPDATE_CLIENT",
            "Client",
            updatedClient.id,
            performedById
        );

        return updatedClient;
    }

    async getClientById(id: number): Promise<Client> {
        const client = await this.clientRepository.findOne({ where: { id }, relations: ["auditLogs"] });
        if (!client) {
            throw new Error("Cliente no encontrado");
        }
        return client;
    }

    async listClients(): Promise<Client[]> {
        return this.clientRepository.find({ relations: ["auditLogs"] });
    }
}