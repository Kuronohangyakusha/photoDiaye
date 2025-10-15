import prisma from "../prisma/client.js";

export class FavoriRepository {
  async create(data: any) {
    return prisma.favori.create({ data });
  }

  async findByUtilisateur(utilisateurId: string) {
    return prisma.favori.findMany({
      where: { utilisateurId },
      include: { article: true },
    });
  }

  async delete(utilisateurId: string, articleId: string) {
    return prisma.favori.delete({
      where: { utilisateurId_articleId: { utilisateurId, articleId } },
    });
  }
}
