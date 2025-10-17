import prisma from "../prisma/client.js";

export class UtilisateurRepository {
  async create(data: any) {
    return prisma.utilisateur.create({ data });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [utilisateurs, total] = await Promise.all([
      prisma.utilisateur.findMany({
        skip,
        take: limit,
        orderBy: { creeLe: 'desc' }
      }),
      prisma.utilisateur.count()
    ]);

    return {
      utilisateurs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: string) {
    return prisma.utilisateur.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.utilisateur.findUnique({ where: { email } });
  }

  async update(id: string, data: any) {
    return prisma.utilisateur.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.vueArticle.deleteMany({ where: { utilisateurId: id } });
      await tx.favori.deleteMany({ where: { utilisateurId: id } });
      await tx.signalement.deleteMany({ where: { auteurId: id } });
      await tx.notification.deleteMany({ where: { utilisateurId: id } });

      // Delete articles by this user (cascade delete related records)
      const userArticles = await tx.article.findMany({
        where: { vendeurId: id },
        select: { id: true }
      });

      for (const article of userArticles) {
        await tx.vueArticle.deleteMany({ where: { articleId: article.id } });
        await tx.favori.deleteMany({ where: { articleId: article.id } });
        await tx.signalement.deleteMany({ where: { articleId: article.id } });
      }

      await tx.article.deleteMany({ where: { vendeurId: id } });

      // Finally delete the user
      return tx.utilisateur.delete({ where: { id } });
    });
  }

  async findAdmins() {
    return prisma.utilisateur.findMany({
      where: { role: 'ADMIN' }
    });
  }
}
