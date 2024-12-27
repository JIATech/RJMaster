import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from "typeorm";
import { DataEntry } from "./dataEntry";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string; // Nombre del cliente

    @Column({ nullable: true })
    email?: string; // Email del cliente, opcional

    @Column({ nullable: true })
    phoneNumber?: string; // Teléfono del cliente, opcional

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => DataEntry, (dataEntry) => dataEntry.client)
    dataEntries!: DataEntry[]; // Relación con datos asociados al cliente
}
