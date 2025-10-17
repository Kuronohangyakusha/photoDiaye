import prisma from "../prisma/client.js";

export class VueArticleRepository {
  async create(data: any) {
    return prisma.vueArticle.create({ data });
  }

  async findAll() {
    return prisma.vueArticle.findMany({ include: { article: true } });
  }

  async findByArticle(articleId: string) {
    return prisma.vueArticle.findMany({ where: { articleId } });
  }

  async findByArticleAndUser(articleId: string, utilisateurId?: string, ip?: string) {
    const where: any = { articleId };
    if (utilisateurId) {
      where.utilisateurId = utilisateurId;
    } else if (ip) {
      where.ip = ip;
    }
    return prisma.vueArticle.findFirst({
      where,
      orderBy: { creeLe: 'desc' }
    });
  }

  async delete(id: string) {
    return prisma.vueArticle.delete({ where: { id } });
  }
}
