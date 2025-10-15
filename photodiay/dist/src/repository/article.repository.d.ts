export declare class ArticleRepository {
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
    findAll(): Promise<({
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
    findById(id: string): Promise<({
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
    findByVendeur(vendeurId: string): Promise<{
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
//# sourceMappingURL=article.repository.d.ts.map