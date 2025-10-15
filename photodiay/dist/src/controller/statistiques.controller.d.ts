import type { Request, Response } from "express";
export declare class StatistiquesController {
    getLatest(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=statistiques.controller.d.ts.map