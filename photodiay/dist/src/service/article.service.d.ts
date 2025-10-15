export declare class ArticleService {
    create(data: any): Promise<{
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
        vendeurId: string;
    }>;
    getAll(): Promise<({
        vendeur: {
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
        };
    } & {
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
        vendeurId: string;
    })[]>;
    getById(id: string): Promise<({
        vendeur: {
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
        };
    } & {
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
        vendeurId: string;
    }) | null>;
    getByVendeur(vendeurId: string): Promise<{
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
        vendeurId: string;
    }[]>;
    update(id: string, data: any): Promise<{
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
        vendeurId: string;
    }>;
    delete(id: string): Promise<{
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
        vendeurId: string;
    }>;
    incrementVues(articleId: string): Promise<{
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
        vendeurId: string;
    }>;
}
//# sourceMappingURL=article.service.d.ts.map