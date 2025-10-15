import type { Request, Response } from "express";
export declare class FavoriController {
    addFavori(req: Request, res: Response): Promise<void>;
    getByUtilisateur(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    removeFavori(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=favori.controller.d.ts.map