export declare class SignalementService {
    addSignalement(data: any): Promise<{
        id: string;
        creeLe: Date;
        description: string | null;
        articleId: string;
        raison: string;
        auteurId: string | null;
    }>;
    getAll(): Promise<({
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
        auteur: {
            id: string;
            email: string;
            motDePasse: string;
            nom: string | null;
            telephone: string;
            role: import("@prisma/client").$Enums.Role;
            estVip: boolean;
            vipExpireLe: Date | null;
            creeLe: Date;
            misAJourLe: Date;
        } | null;
    } & {
        id: string;
        creeLe: Date;
        description: string | null;
        articleId: string;
        raison: string;
        auteurId: string | null;
    })[]>;
    getByArticle(articleId: string): Promise<({
        auteur: {
            id: string;
            email: string;
            motDePasse: string;
            nom: string | null;
            telephone: string;
            role: import("@prisma/client").$Enums.Role;
            estVip: boolean;
            vipExpireLe: Date | null;
            creeLe: Date;
            misAJourLe: Date;
        } | null;
    } & {
        id: string;
        creeLe: Date;
        description: string | null;
        articleId: string;
        raison: string;
        auteurId: string | null;
    })[]>;
    delete(id: string): Promise<{
        id: string;
        creeLe: Date;
        description: string | null;
        articleId: string;
        raison: string;
        auteurId: string | null;
    }>;
}
//# sourceMappingURL=signalement.service.d.ts.map