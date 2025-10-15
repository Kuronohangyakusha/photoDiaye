import { SignalementRepository } from "../repository/signalement.repository.js";

const signalementRepo = new SignalementRepository();

export class SignalementService {
  async addSignalement(data: any) {
    return signalementRepo.create(data);
  }

  async getAll() {
    return signalementRepo.findAll();
  }

  async getByArticle(articleId: string) {
    return signalementRepo.findByArticle(articleId);
  }

  async delete(id: string) {
    return signalementRepo.delete(id);
  }
}
