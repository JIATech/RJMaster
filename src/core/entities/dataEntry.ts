import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from "typeorm";
import { User } from "./user";
import { Client } from "./client";

@Entity()
export class DataEntry {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    key!: string; // Identificador del dato, por ejemplo "direccion_cliente"

    @Column("text")
    value!: string; // Valor del dato, por ejemplo "Calle Falsa 123"

    @ManyToOne(() => User, { nullable: false })
    addedBy!: User; // Usuario que agregó el dato

    @ManyToOne(() => Client, { nullable: true })
    client!: Client; // Cliente al que se asocia el dato (si aplica)

    @CreateDateColumn()
    createdAt!: Date;
}
