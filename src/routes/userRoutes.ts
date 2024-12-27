import { Router } from "express";
import { UserService } from "../core/services/userService";
import { AppDataSource } from "../adapters/postgres/userRepository";
import { User } from "../core/entities/user";
import { Role } from "../core/entities/role";

const router = Router();
const userService = new UserService(
    AppDataSource.getRepository(User),
    AppDataSource.getRepository(Role)
);

router.post("/", async (req, res) => {
    try {
        const { name, roles } = req.body;
        const user = await userService.createUser({ name }, roles || []);
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});


router.get("/", async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Unknown error" });
        }
    }
});


export default router;
