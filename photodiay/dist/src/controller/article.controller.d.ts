import type { Request, Response } from "express";
export declare class ArticleController {
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createOld(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAll(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getByVendeur(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    incrementVues(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=article.controller.d.ts.map