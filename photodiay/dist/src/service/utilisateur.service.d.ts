export declare class UtilisateurService {
    getAll(page?: number, limit?: number): Promise<{
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
    getById(id: string): Promise<{
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
//# sourceMappingURL=utilisateur.service.d.ts.map