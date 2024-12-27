import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { User } from "./user";

@Entity()
export class AuditLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    action!: string; // Acción realizada, ej.: "CREATE_CLIENT", "UPDATE_DATA_ENTRY"

    @Column()
    entity!: string; // Entidad afectada, ej.: "Client", "DataEntry"

    @Column({ nullable: true })
    entityId?: number; // ID de la entidad afectada

    @ManyToOne(() => User, { nullable: true })
    performedBy?: User; // Usuario que realizó la acción

    @CreateDateColumn()
    performedAt!: Date; // Fecha y hora de la acción
}
