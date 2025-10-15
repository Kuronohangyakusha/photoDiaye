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

  async delete(id: string) {
    return prisma.vueArticle.delete({ where: { id } });
  }
}
