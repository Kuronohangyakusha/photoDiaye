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
    return prisma.utilisateur.delete({ where: { id } });
  }
}
