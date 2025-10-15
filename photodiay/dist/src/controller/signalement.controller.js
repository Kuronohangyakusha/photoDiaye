import { SignalementService } from "../service/signalement.service.js";
const signalementService = new SignalementService();
export class SignalementController {
    async addSignalement(req, res) {
        const signalement = await signalementService.addSignalement(req.body);
        res.json(signalement);
    }
    async getAll(req, res) {
        const signalements = await signalementService.getAll();
        res.json(signalements);
    }
    async getByArticle(req, res) {
        const articleId = req.params.articleId;
        if (!articleId) {
            return res.status(400).json({ error: "ID article requis" });
        }
        const signalements = await signalementService.getByArticle(articleId);
        res.json(signalements);
    }
    async delete(req, res) {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "ID requis" });
        }
        await signalementService.delete(id);
        res.json({ message: "Signalement supprimé" });
    }
}
//# sourceMappingURL=signalement.controller.js.map