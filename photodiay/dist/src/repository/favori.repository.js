import prisma from "../prisma/client.js";
export class FavoriRepository {
    async create(data) {
        return prisma.favori.create({ data });
    }
    async findByUtilisateur(utilisateurId) {
        return prisma.favori.findMany({
            where: { utilisateurId },
            include: { article: true },
        });
    }
    async delete(utilisateurId, articleId) {
        return prisma.favori.delete({
            where: { utilisateurId_articleId: { utilisateurId, articleId } },
        });
    }
}
//# sourceMappingURL=favori.repository.js.map