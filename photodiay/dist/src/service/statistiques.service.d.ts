export declare class StatistiquesService {
    getLatest(): Promise<{
        totalArticles: number;
        totalUsers: number;
        totalViews: number;
        totalReports: number;
        misAJourLe: Date;
    }>;
    create(data: any): Promise<{
        id: string;
        misAJourLe: Date;
        totalArticles: number;
        totalUtilisateurs: number;
        totalVues: number;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        misAJourLe: Date;
        totalArticles: number;
        totalUtilisateurs: number;
        totalVues: number;
    }>;
}
//# sourceMappingURL=statistiques.service.d.ts.map