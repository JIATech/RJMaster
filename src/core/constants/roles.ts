export const ROLES = {
    MANAGER: "manager", // Puede hacer todo
    AUDITOR: "auditor", // Solo puede ver
    CREATOR: "creator", // Solo puede crear
    MODIFIER: "modifier", // Solo puede actualizar
    DELETER: "deleter", // Solo puede eliminar
};

export const DEFAULT_ROLES = [
    ROLES.MANAGER,
    ROLES.AUDITOR,
    ROLES.CREATOR,
    ROLES.MODIFIER,
    ROLES.DELETER,
];
