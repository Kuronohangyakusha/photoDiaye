import { FavoriRepository } from "../repository/favori.repository.js";
const favoriRepo = new FavoriRepository();
export class FavoriService {
    async addFavori(data) {
        return favoriRepo.create(data);
    }
    async getByUtilisateur(utilisateurId) {
        return favoriRepo.findByUtilisateur(utilisateurId);
    }
    async removeFavori(utilisateurId, articleId) {
        return favoriRepo.delete(utilisateurId, articleId);
    }
}
//# sourceMappingURL=favori.service.js.map