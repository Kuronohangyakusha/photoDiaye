export declare class VueService {
    addVue(data: any): Promise<{
        id: string;
        creeLe: Date;
        ip: string | null;
        articleId: string;
        utilisateurId: string | null;
    }>;
    getByArticle(articleId: string): Promise<{
        id: string;
        creeLe: Date;
        ip: string | null;
        articleId: string;
        utilisateurId: string | null;
    }[]>;
    canIncrementView(articleId: string, utilisateurId?: string, ip?: string): Promise<boolean>;
}
//# sourceMappingURL=vue.service.d.ts.map