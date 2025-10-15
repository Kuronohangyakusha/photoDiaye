import { UtilisateurRepository } from "../repository/utilisateur.repository.js";

const utilisateurRepo = new UtilisateurRepository();

export class UtilisateurService {
  async getAll(page: number = 1, limit: number = 10) {
    return utilisateurRepo.findAll(page, limit);
  }

  async getById(id: string) {
    return utilisateurRepo.findById(id);
  }

  async update(id: string, data: any) {
    return utilisateurRepo.update(id, data);
  }

  async delete(id: string) {
    return utilisateurRepo.delete(id);
  }
}
