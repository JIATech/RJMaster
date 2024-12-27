import { Repository } from "typeorm";
import { Role } from "../entities/role";
import { DEFAULT_ROLES } from "../constants/roles";

export async function initializeRoles(roleRepository: Repository<Role>): Promise<void> {
    for (const roleName of DEFAULT_ROLES) {
        const existingRole = await roleRepository.findOne({ where: { name: roleName } });
        if (!existingRole) {
            const newRole = roleRepository.create({ name: roleName });
            await roleRepository.save(newRole);
            console.log(`Rol creado: ${roleName}`);
        }
    }
}
