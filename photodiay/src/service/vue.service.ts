import { VueArticleRepository } from "../repository/vue.repository.js";

const vueRepo = new VueArticleRepository();

export class VueService {
  async addVue(data: any) {
    return vueRepo.create(data);
  }

  async getByArticle(articleId: string) {
    return vueRepo.findByArticle(articleId);
  }

  async canIncrementView(articleId: string, utilisateurId?: string, ip?: string) {
    const lastView = await vueRepo.findByArticleAndUser(articleId, utilisateurId, ip);
    if (!lastView) return true;

    // Vérifier si la dernière vue date d'il y a plus de 24 heures
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    return lastView.creeLe < oneDayAgo;
  }
}
