import prisma from "../prisma/client.js";

export class ArticleRepository {
  async create(data: any) {
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

  async findAllForAdmin(limit: number = 10, offset: number = 0, search: string = '') {
    const where: any = {};

    if (search.trim()) {
      where.OR = [
        { titre: { contains: search.trim(), mode: 'insensitive' } },
        { vendeur: { nom: { contains: search.trim(), mode: 'insensitive' } } },
        { vendeur: { telephone: { contains: search.trim() } } }
      ];
    }

    return prisma.article.findMany({
      where,
      include: { vendeur: true },
      orderBy: { publieLe: "desc" },
      take: limit,
      skip: offset,
    });
  }

  async countAllForAdmin(search: string = '') {
    const where: any = {};

    if (search.trim()) {
      where.OR = [
        { titre: { contains: search.trim(), mode: 'insensitive' } },
        { vendeur: { nom: { contains: search.trim(), mode: 'insensitive' } } },
        { vendeur: { telephone: { contains: search.trim() } } }
      ];
    }

    return prisma.article.count({ where });
  }

  async findById(id: string) {
    return prisma.article.findUnique({
      where: { id },
      include: { vendeur: true },
    });
  }

  async findByVendeur(vendeurId: string) {
    return prisma.article.findMany({
      where: { vendeurId },
      orderBy: { publieLe: "desc" },
    });
  }

  async update(id: string, data: any) {
    return prisma.article.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.vueArticle.deleteMany({ where: { articleId: id } });
      await tx.favori.deleteMany({ where: { articleId: id } });
      await tx.signalement.deleteMany({ where: { articleId: id } });

      // Then delete the article
      return tx.article.delete({ where: { id } });
    });
  }

  async incrementVues(articleId: string) {
    return prisma.article.update({
      where: { id: articleId },
      data: { nombreVues: { increment: 1 } },
    });
  }

  async approveArticle(id: string) {
    return prisma.article.update({
      where: { id },
      data: { statut: "ACTIF" },
    });
  }

  async rejectArticle(id: string, motifRejet: string) {
    return prisma.article.update({
      where: { id },
      data: {
        statut: "REFUSE",
        motifRejet: motifRejet
      },
    });
  }

  async findExpiredArticles() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return prisma.article.findMany({
      where: {
        statut: "EN_ATTENTE",
        publieLe: {
          lte: sevenDaysAgo
        }
      },
      include: { vendeur: true }
    });
  }

  async markForDeletion(id: string) {
    return prisma.article.update({
      where: { id },
      data: {
        statut: "EXPIRE",
        supprimeLe: new Date()
      }
    });
  }

  async confirmDeletion(id: string) {
    return this.delete(id);
  }

  async deleteOldArticles(days: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return prisma.article.deleteMany({
      where: {
        publieLe: {
          lt: cutoffDate
        },
        statut: {
          in: ['ACTIF', 'REFUSE', 'EXPIRE']
        }
      }
    });
  }
}
