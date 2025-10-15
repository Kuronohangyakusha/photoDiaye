import { ArticleRepository } from "../repository/article.repository.js";
const articleRepo = new ArticleRepository();
export class ArticleService {
    async create(data) {
        // Validation des données
        if (!data.titre || !data.prix || !data.vendeurId) {
            throw new Error("Titre, prix et vendeurId sont requis");
        }
        if (data.prix <= 0) {
            throw new Error("Le prix doit être positif");
        }
        // Calculer la date d'expiration (7 jours)
        const expireLe = new Date();
        expireLe.setDate(expireLe.getDate() + 7);
        const articleData = {
            ...data,
            expireLe,
            statut: "ACTIF"
        };
        return articleRepo.create(articleData);
    }
    async getAll() {
        return articleRepo.findAll();
    }
    async getById(id) {
        return articleRepo.findById(id);
    }
    async getByVendeur(vendeurId) {
        return articleRepo.findByVendeur(vendeurId);
    }
    async update(id, data) {
        return articleRepo.update(id, data);
    }
    async delete(id) {
        return articleRepo.delete(id);
    }
    async incrementVues(articleId) {
        return articleRepo.incrementVues(articleId);
    }
}
//# sourceMappingURL=article.service.js.map