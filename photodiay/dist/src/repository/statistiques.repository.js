import prisma from "../prisma/client.js";
export class StatistiquesAdminRepository {
    async getLatest() {
        // Toujours recalculer les statistiques en temps réel
        const totalArticles = await prisma.article.count();
        const totalUsers = await prisma.utilisateur.count();
        const totalViews = await prisma.vueArticle.count();
        const totalReports = await prisma.signalement.count();
        return {
            totalArticles,
            totalUsers,
            totalViews,
            totalReports,
            misAJourLe: new Date()
        };
    }
    async create(data) {
        return prisma.statistiquesAdmin.create({ data });
    }
    async update(id, data) {
        return prisma.statistiquesAdmin.update({
            where: { id },
            data,
        });
    }
}
//# sourceMappingURL=statistiques.repository.js.map