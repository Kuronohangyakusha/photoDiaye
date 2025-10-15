import type { Request, Response } from "express";
import { SignalementService } from "../service/signalement.service.js";

const signalementService = new SignalementService();

export class SignalementController {
  async addSignalement(req: Request, res: Response) {
    const signalement = await signalementService.addSignalement(req.body);
    res.json(signalement);
  }

  async getAll(req: Request, res: Response) {
    const signalements = await signalementService.getAll();
    res.json(signalements);
  }

  async getByArticle(req: Request, res: Response) {
    const articleId = req.params.articleId;
    if (!articleId) {
      return res.status(400).json({ error: "ID article requis" });
    }
    const signalements = await signalementService.getByArticle(articleId);
    res.json(signalements);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "ID requis" });
    }
    await signalementService.delete(id);
    res.json({ message: "Signalement supprimé" });
  }
}
