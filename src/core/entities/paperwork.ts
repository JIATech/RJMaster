import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Paperwork {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    description!: string;

    @Column({
        type: "enum",
        enum: ["draft", "in_progress", "completed"],
        default: "draft",
    })
    status!: "draft" | "in_progress" | "completed";

    @ManyToOne(() => User, (user) => user.papeleos, { nullable: false })
    @JoinColumn({ name: "created_by" })
    createdBy!: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "approved_by" })
    approvedBy?: User;

    @CreateDateColumn()
    createdAt!: Date;

    @CreateDateColumn({ nullable: true })
    updatedAt?: Date;
}
