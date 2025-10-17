import prisma from "../prisma/client.js";
export class VueArticleRepository {
    async create(data) {
        return prisma.vueArticle.create({ data });
    }
    async findAll() {
        return prisma.vueArticle.findMany({ include: { article: true } });
    }
    async findByArticle(articleId) {
        return prisma.vueArticle.findMany({ where: { articleId } });
    }
    async findByArticleAndUser(articleId, utilisateurId, ip) {
        const where = { articleId };
        if (utilisateurId) {
            where.utilisateurId = utilisateurId;
        }
        else if (ip) {
            where.ip = ip;
        }
        return prisma.vueArticle.findFirst({
            where,
            orderBy: { creeLe: 'desc' }
        });
    }
    async delete(id) {
        return prisma.vueArticle.delete({ where: { id } });
    }
}
//# sourceMappingURL=vue.repository.js.map