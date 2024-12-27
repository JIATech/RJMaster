import { Repository, DeepPartial } from "typeorm";
import { AuditLog } from "../entities/auditLog";
import { User } from "../entities/user";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";

export class AuditLogService {
    constructor(private auditLogRepository: Repository<AuditLog>) { }

    async logAction(
        action: string,
        entity: string,
        entityId: number | null,
        performedById: number | null
    ): Promise<AuditLog> {
        const auditLogData: DeepPartial<AuditLog> = {
            action,
            entity,
            entityId: entityId ?? undefined,
            performedBy: performedById ? { id: performedById } as Partial<User> : undefined,
        };
        const auditLog: AuditLog = this.auditLogRepository.create(auditLogData);
        return this.auditLogRepository.save(auditLog);
    }

    async listLogs(
        filters: {
            action?: string;
            entity?: string;
            performedById?: number;
            startDate?: string;
            endDate?: string;
        } = {},
        page: number = 1,
        pageSize: number = 10
    ): Promise<{ logs: any[]; total: number }> {
        const queryBuilder = this.auditLogRepository.createQueryBuilder("auditLog");

        // Aplicar filtros dinámicos
        if (filters.action) {
            queryBuilder.andWhere("auditLog.action = :action", { action: filters.action });
        }
        if (filters.entity) {
            queryBuilder.andWhere("auditLog.entity = :entity", { entity: filters.entity });
        }
        if (filters.performedById) {
            queryBuilder.andWhere("auditLog.performedById = :performedById", {
                performedById: filters.performedById,
            });
        }
        if (filters.startDate) {
            queryBuilder.andWhere("auditLog.performedAt >= :startDate", { startDate: filters.startDate });
        }
        if (filters.endDate) {
            queryBuilder.andWhere("auditLog.performedAt <= :endDate", { endDate: filters.endDate });
        }

        // Relación con usuarios
        queryBuilder.leftJoinAndSelect("auditLog.performedBy", "user");

        // Paginación
        const total = await queryBuilder.getCount();
        const logs = await queryBuilder
            .skip((page - 1) * pageSize) // Desplazamiento
            .take(pageSize) // Límite
            .getMany();

        // Convertir fechas a zona horaria local
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formattedLogs = logs.map((log) => ({
            ...log,
            performedAt: this.convertToLocalTime(log.performedAt, timeZone),
        }));

        return { logs: formattedLogs, total };
    }

    private convertToLocalTime(utcDate: Date, timeZone: string): string {
        const zonedDate = toZonedTime(utcDate, timeZone);
        return format(zonedDate, "yyyy-MM-dd HH:mm:ss");
    }
}
