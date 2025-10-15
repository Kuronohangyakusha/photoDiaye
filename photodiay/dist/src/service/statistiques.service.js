import { StatistiquesAdminRepository } from "../repository/statistiques.repository.js";
const statsRepo = new StatistiquesAdminRepository();
export class StatistiquesService {
    async getLatest() {
        return statsRepo.getLatest();
    }
    async create(data) {
        return statsRepo.create(data);
    }
    async update(id, data) {
        return statsRepo.update(id, data);
    }
}
//# sourceMappingURL=statistiques.service.js.map