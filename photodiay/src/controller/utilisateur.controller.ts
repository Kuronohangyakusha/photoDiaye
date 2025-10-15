import type { Request, Response } from "express";
import { UtilisateurService } from "../service/utilisateur.service.js";

const utilisateurService = new UtilisateurService();

export class UtilisateurController {
  async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const utilisateurs = await utilisateurService.getAll(page, limit);
    res.json(utilisateurs);
  }

  async getById(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "ID requis" });
    }
    const utilisateur = await utilisateurService.getById(id);
    res.json(utilisateur);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "ID requis" });
    }
    const utilisateur = await utilisateurService.update(id, req.body);
    res.json(utilisateur);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "ID requis" });
    }
    await utilisateurService.delete(id);
    res.json({ message: "Utilisateur supprimé" });
  }
}
