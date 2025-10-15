import { UtilisateurRepository } from "../repository/utilisateur.repository.js";
const utilisateurRepo = new UtilisateurRepository();
export class UtilisateurService {
    async getAll(page = 1, limit = 10) {
        return utilisateurRepo.findAll(page, limit);
    }
    async getById(id) {
        return utilisateurRepo.findById(id);
    }
    async update(id, data) {
        return utilisateurRepo.update(id, data);
    }
    async delete(id) {
        return utilisateurRepo.delete(id);
    }
}
//# sourceMappingURL=utilisateur.service.js.map