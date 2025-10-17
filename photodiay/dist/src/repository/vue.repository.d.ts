export declare class VueArticleRepository {
    create(data: any): Promise<{
        id: string;
        creeLe: Date;
        ip: string | null;
        articleId: string;
        utilisateurId: string | null;
    }>;
    findAll(): Promise<({
        article: {
            id: string;
            vendeurTelephone: string;
            titre: string;
            description: string | null;
            prix: number;
            categorie: string | null;
            urlImage: string;
            photoPriseAvecApp: boolean;
            statut: import("@prisma/client").$Enums.StatutArticle;
            publieLe: Date;
            expireLe: Date;
            supprimeLe: Date | null;
            nombreVues: number;
            nombreInteractions: number;
            motifRejet: string | null;
            vendeurId: string;
        };
    } & {
        id: string;
        creeLe: Date;
        ip: string | null;
        articleId: string;
        utilisateurId: string | null;
    })[]>;
    findByArticle(articleId: string): Promise<{
        id: string;
        creeLe: Date;
        ip: string | null;
        articleId: string;
        utilisateurId: string | null;
    }[]>;
    findByArticleAndUser(articleId: string, utilisateurId?: string, ip?: string): Promise<{
        id: string;
        creeLe: Date;
        ip: string | null;
        articleId: string;
        utilisateurId: string | null;
    } | null>;
    delete(id: string): Promise<{
        id: string;
        creeLe: Date;
        ip: string | null;
        articleId: string;
        utilisateurId: string | null;
    }>;
}
//# sourceMappingURL=vue.repository.d.ts.map