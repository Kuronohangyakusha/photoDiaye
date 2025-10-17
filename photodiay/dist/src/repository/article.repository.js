import prisma from "../prisma/client.js";
export class ArticleRepository {
    async create(data) {
        return prisma.article.create({ data });
    }
    async findAll() {
        return prisma.article.findMany({
            where: { statut: "ACTIF" },
            include: { vendeur: true },
            orderBy: { publieLe: "desc" },
        });
    }
    async findAllPending() {
        return prisma.article.findMany({
            where: { statut: "EN_ATTENTE" },
            include: { vendeur: true },
            orderBy: { publieLe: "desc" },
        });
    }
    async findAllForAdmin() {
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
        return prisma.$transaction(async (tx) => {
            // Delete related records first
            await tx.vueArticle.deleteMany({ where: { articleId: id } });
            await tx.favori.deleteMany({ where: { articleId: id } });
            await tx.signalement.deleteMany({ where: { articleId: id } });
            // Then delete the article
            return tx.article.delete({ where: { id } });
        });
    }
    async incrementVues(articleId) {
        return prisma.article.update({
            where: { id: articleId },
            data: { nombreVues: { increment: 1 } },
        });
    }
    async approveArticle(id) {
        return prisma.article.update({
            where: { id },
            data: { statut: "ACTIF" },
        });
    }
    async rejectArticle(id, motifRejet) {
        return prisma.article.update({
            where: { id },
            data: {
                statut: "REFUSE",
                motifRejet: motifRejet
            },
        });
    }
}
//# sourceMappingURL=article.repository.js.map