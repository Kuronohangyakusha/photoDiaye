import type { Request, Response } from "express";
import { FavoriService } from "../service/favori.service.js";

const favoriService = new FavoriService();

export class FavoriController {
  async addFavori(req: Request, res: Response) {
    const favori = await favoriService.addFavori(req.body);
    res.json(favori);
  }

  async getByUtilisateur(req: Request, res: Response) {
    const utilisateurId = req.params.utilisateurId;
    if (!utilisateurId) {
      return res.status(400).json({ error: "ID utilisateur requis" });
    }
    const favoris = await favoriService.getByUtilisateur(utilisateurId);
    res.json(favoris);
  }

  async removeFavori(req: Request, res: Response) {
    const utilisateurId = req.params.utilisateurId;
    const articleId = req.params.articleId;
    if (!utilisateurId || !articleId) {
      return res.status(400).json({ error: "IDs requis" });
    }
    await favoriService.removeFavori(utilisateurId, articleId);
    res.json({ message: "Favori supprimé" });
  }
}
