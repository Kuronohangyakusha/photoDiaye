import { SignalementRepository } from "../repository/signalement.repository.js";
const signalementRepo = new SignalementRepository();
export class SignalementService {
    async addSignalement(data) {
        return signalementRepo.create(data);
    }
    async getAll() {
        return signalementRepo.findAll();
    }
    async getByArticle(articleId) {
        return signalementRepo.findByArticle(articleId);
    }
    async delete(id) {
        return signalementRepo.delete(id);
    }
}
//# sourceMappingURL=signalement.service.js.map