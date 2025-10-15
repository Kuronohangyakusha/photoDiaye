import { FavoriRepository } from "../repository/favori.repository.js";

const favoriRepo = new FavoriRepository();

export class FavoriService {
  async addFavori(data: any) {
    return favoriRepo.create(data);
  }

  async getByUtilisateur(utilisateurId: string) {
    return favoriRepo.findByUtilisateur(utilisateurId);
  }

  async removeFavori(utilisateurId: string, articleId: string) {
    return favoriRepo.delete(utilisateurId, articleId);
  }
}
