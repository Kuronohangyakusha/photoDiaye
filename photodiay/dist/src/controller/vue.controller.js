import { VueService } from "../service/vue.service.js";
const vueService = new VueService();
export class VueController {
    async addVue(req, res) {
        const vue = await vueService.addVue(req.body);
        res.json(vue);
    }
    async getByArticle(req, res) {
        const articleId = req.params.articleId;
        if (!articleId) {
            return res.status(400).json({ error: "ID article requis" });
        }
        const vues = await vueService.getByArticle(articleId);
        res.json(vues);
    }
}
//# sourceMappingURL=vue.controller.js.map