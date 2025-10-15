import prisma from "../prisma/client.js";
export class SignalementRepository {
    async create(data) {
        return prisma.signalement.create({ data });
    }
    async findAll() {
        return prisma.signalement.findMany({
            include: { article: true, auteur: true },
        });
    }
    async findByArticle(articleId) {
        return prisma.signalement.findMany({
            where: { articleId },
            include: { auteur: true },
        });
    }
    async delete(id) {
        return prisma.signalement.delete({ where: { id } });
    }
}
//# sourceMappingURL=signalement.repository.js.map