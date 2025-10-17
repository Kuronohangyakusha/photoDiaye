export declare class FavoriService {
    addFavori(data: any): Promise<{
        id: string;
        creeLe: Date;
        articleId: string;
        utilisateurId: string;
    }>;
    getByUtilisateur(utilisateurId: string): Promise<({
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
    removeFavori(utilisateurId: string, articleId: string): Promise<{
        id: string;
        creeLe: Date;
        articleId: string;
        utilisateurId: string;
    }>;
}
//# sourceMappingURL=favori.service.d.ts.map