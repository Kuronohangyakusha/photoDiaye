import { AuthService } from "../service/auth.service.js";
const authService = new AuthService();
export class AuthController {
    async register(req, res) {
        try {
            const user = await authService.register(req.body);
            res.json(user);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    async login(req, res) {
        try {
            const { email, motDePasse } = req.body;
            const result = await authService.login(email, motDePasse);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}
//# sourceMappingURL=auth.controller.js.map