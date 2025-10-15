import { VueArticleRepository } from "../repository/vue.repository.js";

const vueRepo = new VueArticleRepository();

export class VueService {
  async addVue(data: any) {
    return vueRepo.create(data);
  }

  async getByArticle(articleId: string) {
    return vueRepo.findByArticle(articleId);
  }
}
