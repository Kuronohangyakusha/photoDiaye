import prisma from "../prisma/client.js";
export class UtilisateurRepository {
    async create(data) {
        return prisma.utilisateur.create({ data });
    }
    async findAll(page = 1, limit = 10) {
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
    async findById(id) {
        return prisma.utilisateur.findUnique({ where: { id } });
    }
    async findByEmail(email) {
        return prisma.utilisateur.findUnique({ where: { email } });
    }
    async update(id, data) {
        return prisma.utilisateur.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma.utilisateur.delete({ where: { id } });
    }
}
//# sourceMappingURL=utilisateur.repository.js.map