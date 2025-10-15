import { StatistiquesService } from "../service/statistiques.service.js";
const statsService = new StatistiquesService();
export class StatistiquesController {
    async getLatest(req, res) {
        const stats = await statsService.getLatest();
        res.json(stats);
    }
    async create(req, res) {
        const stats = await statsService.create(req.body);
        res.json(stats);
    }
    async update(req, res) {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "ID requis" });
        }
        const stats = await statsService.update(id, req.body);
        res.json(stats);
    }
}
//# sourceMappingURL=statistiques.controller.js.map