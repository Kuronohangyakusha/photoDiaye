import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationRepository {
  async create(data: {
    utilisateurId: string;
    titre: string;
    message: string;
    type: string;
    articleId?: string;
  }) {
    return prisma.notification.create({
      data
    });
  }

  async findByUtilisateur(utilisateurId: string, limit: number = 50) {
    return prisma.notification.findMany({
      where: { utilisateurId },
      orderBy: { creeLe: 'desc' },
      take: limit
    });
  }

  async findUnreadByUtilisateur(utilisateurId: string) {
    return prisma.notification.findMany({
      where: {
        utilisateurId,
        lue: false
      },
      orderBy: { creeLe: 'desc' }
    });
  }

  async markAsRead(id: string, utilisateurId: string) {
    return prisma.notification.updateMany({
      where: {
        id,
        utilisateurId
      },
      data: { lue: true }
    });
  }

  async markAllAsRead(utilisateurId: string) {
    return prisma.notification.updateMany({
      where: { utilisateurId },
      data: { lue: true }
    });
  }

  async delete(id: string, utilisateurId: string) {
    return prisma.notification.deleteMany({
      where: {
        id,
        utilisateurId
      }
    });
  }

  async getCountUnread(utilisateurId: string) {
    return prisma.notification.count({
      where: {
        utilisateurId,
        lue: false
      }
    });
  }
}