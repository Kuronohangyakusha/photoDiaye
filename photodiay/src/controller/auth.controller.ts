import type { Request, Response } from "express";
import { AuthService } from "../service/auth.service.js";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, motDePasse } = req.body;
      const result = await authService.login(email, motDePasse);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
