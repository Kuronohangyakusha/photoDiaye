import { StatistiquesAdminRepository } from "../repository/statistiques.repository.js";

const statsRepo = new StatistiquesAdminRepository();

export class StatistiquesService {
  async getLatest() {
    return statsRepo.getLatest();
  }

  async create(data: any) {
    return statsRepo.create(data);
  }

  async update(id: string, data: any) {
    return statsRepo.update(id, data);
  }
}
