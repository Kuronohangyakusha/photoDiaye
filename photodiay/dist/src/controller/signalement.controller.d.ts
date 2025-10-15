import type { Request, Response } from "express";
export declare class SignalementController {
    addSignalement(req: Request, res: Response): Promise<void>;
    getAll(req: Request, res: Response): Promise<void>;
    getByArticle(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=signalement.controller.d.ts.map