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
    async delete(id) {
        return prisma.vueArticle.delete({ where: { id } });
    }
}
//# sourceMappingURL=vue.repository.js.map