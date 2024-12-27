import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from "typeorm";
import { User } from "./user";

@Entity()
export class DocumentLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    documentType!: string; // Tipo de documento generado, por ejemplo "Contrato"

    @ManyToOne(() => User, { nullable: false })
    generatedBy!: User; // Usuario que generó el documento

    @CreateDateColumn()
    generatedAt!: Date;
}
