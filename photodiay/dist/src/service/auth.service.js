import { UtilisateurRepository } from "../repository/utilisateur.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const utilisateurRepo = new UtilisateurRepository();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
export class AuthService {
    async register(data) {
        const hashedPassword = await bcrypt.hash(data.motDePasse, 10);
        return utilisateurRepo.create({ ...data, motDePasse: hashedPassword });
    }
    async login(email, motDePasse) {
        const user = await utilisateurRepo.findByEmail(email);
        if (!user)
            throw new Error("Utilisateur non trouvé");
        const valid = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!valid)
            throw new Error("Mot de passe incorrect");
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, telephone: user.telephone }, JWT_SECRET, { expiresIn: "7d" });
        return { user, token };
    }
    async verifyToken(token) {
        return jwt.verify(token, JWT_SECRET);
    }
}
//# sourceMappingURL=auth.service.js.map