import jwt from "jsonwebtoken";
export declare class AuthService {
    register(data: {
        email: string;
        motDePasse: string;
        nom?: string;
        telephone?: string;
    }): Promise<{
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
    login(email: string, motDePasse: string): Promise<{
        user: {
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
        token: string;
    }>;
    verifyToken(token: string): Promise<string | jwt.JwtPayload>;
}
//# sourceMappingURL=auth.service.d.ts.map