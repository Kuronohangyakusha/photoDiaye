import { VueArticleRepository } from "../repository/vue.repository.js";
const vueRepo = new VueArticleRepository();
export class VueService {
    async addVue(data) {
        return vueRepo.create(data);
    }
    async getByArticle(articleId) {
        return vueRepo.findByArticle(articleId);
    }
}
//# sourceMappingURL=vue.service.js.map