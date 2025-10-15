import type { Request, Response } from "express";
import { VueService } from "../service/vue.service.js";

const vueService = new VueService();

export class VueController {
  async addVue(req: Request, res: Response) {
    const vue = await vueService.addVue(req.body);
    res.json(vue);
  }

  async getByArticle(req: Request, res: Response) {
    const articleId = req.params.articleId;
    if (!articleId) {
      return res.status(400).json({ error: "ID article requis" });
    }
    const vues = await vueService.getByArticle(articleId);
    res.json(vues);
  }
}
