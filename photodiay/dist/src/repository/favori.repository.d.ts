export declare class FavoriRepository {
    create(data: any): Promise<{
        id: string;
        creeLe: Date;
        articleId: string;
        utilisateurId: string;
    }>;
    findByUtilisateur(utilisateurId: string): Promise<({
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
        articleId: string;
        utilisateurId: string;
    })[]>;
    delete(utilisateurId: string, articleId: string): Promise<{
        id: string;
        creeLe: Date;
        articleId: string;
        utilisateurId: string;
    }>;
}
//# sourceMappingURL=favori.repository.d.ts.map