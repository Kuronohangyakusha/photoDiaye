import prisma from "../prisma/client.js";

export class SignalementRepository {
  async create(data: any) {
    return prisma.signalement.create({ data });
  }

  async findAll() {
    return prisma.signalement.findMany({
      include: { article: true, auteur: true },
    });
  }

  async findByArticle(articleId: string) {
    return prisma.signalement.findMany({
      where: { articleId },
      include: { auteur: true },
    });
  }

  async delete(id: string) {
    return prisma.signalement.delete({ where: { id } });
  }
}
