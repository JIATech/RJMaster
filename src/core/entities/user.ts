// src/core/entities/user.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
} from "typeorm";
import { Role } from "./role";
import { Paperwork } from "./paperwork";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string = '';

    @Column()
    email: string = '';

    @CreateDateColumn()
    createdAt: Date = new Date();

    @ManyToMany(() => Role, role => role.users)
    @JoinTable()
    roles!: Role[];
    
    @OneToMany(() => Paperwork, (paperwork: Paperwork) => paperwork.createdBy)
    papeleos!: Paperwork[];
}