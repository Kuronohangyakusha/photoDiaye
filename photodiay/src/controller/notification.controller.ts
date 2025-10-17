import type { Request, Response } from 'express';
import { NotificationService } from '../service/notification.service.js';

const notificationService = new NotificationService();

export class NotificationController {
  async getByUtilisateur(req: Request, res: Response) {
    try {
      const utilisateurId = req.params.utilisateurId;
      if (!utilisateurId) {
        return res.status(400).json({ error: 'ID utilisateur requis' });
      }

      const limit = parseInt(req.query.limit as string) || 50;

      const notifications = await notificationService.getByUtilisateur(utilisateurId, limit);
      res.json(notifications);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async getUnreadByUtilisateur(req: Request, res: Response) {
    try {
      const utilisateurId = req.params.utilisateurId;
      if (!utilisateurId) {
        return res.status(400).json({ error: 'ID utilisateur requis' });
      }

      const notifications = await notificationService.getUnreadByUtilisateur(utilisateurId);
      res.json(notifications);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications non lues:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      const utilisateurId = req.params.utilisateurId;
      if (!utilisateurId) {
        return res.status(400).json({ error: 'ID utilisateur requis' });
      }

      const count = await notificationService.getUnreadCount(utilisateurId);
      res.json({ count });
    } catch (error) {
      console.error('Erreur lors du comptage des notifications non lues:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const utilisateurId = req.body.utilisateurId;

      if (!id || !utilisateurId) {
        return res.status(400).json({ error: 'ID notification et ID utilisateur requis' });
      }

      await notificationService.markAsRead(id, utilisateurId);
      res.json({ success: true });
    } catch (error) {
      console.error('Erreur lors du marquage de la notification comme lue:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const utilisateurId = req.body.utilisateurId;

      if (!utilisateurId) {
        return res.status(400).json({ error: 'ID utilisateur requis' });
      }

      await notificationService.markAllAsRead(utilisateurId);
      res.json({ success: true });
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const utilisateurId = req.body.utilisateurId;

      if (!id || !utilisateurId) {
        return res.status(400).json({ error: 'ID notification et ID utilisateur requis' });
      }

      await notificationService.delete(id, utilisateurId);
      res.json({ success: true });
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}