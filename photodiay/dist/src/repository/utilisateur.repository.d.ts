export declare class UtilisateurRepository {
    create(data: any): Promise<{
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
    }>;
    findAll(page?: number, limit?: number): Promise<{
        utilisateurs: {
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
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<{
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
    } | null>;
    findByEmail(email: string): Promise<{
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
    } | null>;
    update(id: string, data: any): Promise<{
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
    }>;
    delete(id: string): Promise<{
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
    }>;
}
//# sourceMappingURL=utilisateur.repository.d.ts.map