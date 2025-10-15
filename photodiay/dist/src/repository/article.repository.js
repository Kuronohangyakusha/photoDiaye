import prisma from "../prisma/client.js";
export class ArticleRepository {
    async create(data) {
        return prisma.article.create({ data });
    }
    async findAll() {
        return prisma.article.findMany({
            include: { vendeur: true },
            orderBy: { publieLe: "desc" },
        });
    }
    async findById(id) {
        return prisma.article.findUnique({
            where: { id },
            include: { vendeur: true },
        });
    }
    async findByVendeur(vendeurId) {
        return prisma.article.findMany({
            where: { vendeurId },
            orderBy: { publieLe: "desc" },
        });
    }
    async update(id, data) {
        return prisma.article.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma.article.delete({ where: { id } });
    }
    async incrementVues(articleId) {
        return prisma.article.update({
            where: { id: articleId },
            data: { nombreVues: { increment: 1 } },
        });
    }
}
//# sourceMappingURL=article.repository.js.map