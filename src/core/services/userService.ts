import { Repository } from "typeorm";
import { User } from "../entities/user";
import { Role } from "../entities/role";
import { DEFAULT_ROLES } from "../constants/roles";

export class UserService {
    constructor(
        private userRepository: Repository<User>,
        private roleRepository: Repository<Role>
    ) { }

    async createUser(userData: Partial<User>, roleNames: string[]): Promise<User> {
        if (!userData.name) {
            throw new Error("El nombre del usuario es obligatorio");
        }

        // Valida y asigna roles
        const roles = await Promise.all(
            roleNames.map(async (roleName) => {
                const role = await this.roleRepository.findOne({ where: { name: roleName } });
                if (!role) {
                    throw new Error(`Rol no válido: ${roleName}`);
                }
                return role;
            })
        );

        const user = this.userRepository.create({ ...userData, roles });
        return this.userRepository.save(user);
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find({ relations: ["roles"] });
    }
}
