import { NotificationRepository } from '../repository/notification.repository.js';

const notificationRepo = new NotificationRepository();

export class NotificationService {
  async create(data: {
    utilisateurId: string;
    titre: string;
    message: string;
    type: string;
    articleId?: string;
  }) {
    return notificationRepo.create(data);
  }

  async getByUtilisateur(utilisateurId: string, limit: number = 50) {
    return notificationRepo.findByUtilisateur(utilisateurId, limit);
  }

  async getUnreadByUtilisateur(utilisateurId: string) {
    return notificationRepo.findUnreadByUtilisateur(utilisateurId);
  }

  async markAsRead(id: string, utilisateurId: string) {
    return notificationRepo.markAsRead(id, utilisateurId);
  }

  async markAllAsRead(utilisateurId: string) {
    return notificationRepo.markAllAsRead(utilisateurId);
  }

  async delete(id: string, utilisateurId: string) {
    return notificationRepo.delete(id, utilisateurId);
  }

  async getUnreadCount(utilisateurId: string) {
    return notificationRepo.getCountUnread(utilisateurId);
  }

  async createRejectionNotification(vendeurId: string, articleId: string, motifRejet: string, articleTitre: string) {
    const titre = 'Article rejeté';
    const message = `Votre article "${articleTitre}" a été rejeté par l'administrateur.\n\nMotif du rejet: ${motifRejet}\n\nVous pouvez modifier votre article et le soumettre à nouveau pour validation.`;

    return this.create({
      utilisateurId: vendeurId,
      titre,
      message,
      type: 'REJET_ARTICLE',
      articleId
    });
  }

  async createApprovalNotification(vendeurId: string, articleId: string, articleTitre: string) {
    const titre = 'Article approuvé';
    const message = `Félicitations ! Votre article "${articleTitre}" a été approuvé et est maintenant visible sur la plateforme.`;

    return this.create({
      utilisateurId: vendeurId,
      titre,
      message,
      type: 'ARTICLE_APPROUVE',
      articleId
    });
  }

  async createExpirationNotification(vendeurId: string, articleId: string, articleTitre: string) {
    const titre = 'Article expiré';
    const message = `Votre article "${articleTitre}" est en attente de validation depuis plus de 7 jours.\n\nPour éviter la suppression automatique, veuillez confirmer si vous souhaitez garder l'article en attente ou le supprimer définitivement.`;

    return this.create({
      utilisateurId: vendeurId,
      titre,
      message,
      type: 'ARTICLE_EXPIRE',
      articleId
    });
  }

  async createArticleSubmissionNotification(vendeurId: string, articleId: string, articleTitre: string, vendeurNom: string) {
    const titre = 'Nouvelle demande d\'approbation d\'article';
    const message = `Le vendeur ${vendeurNom} a soumis un nouvel article "${articleTitre}" pour approbation.`;

    return this.create({
      utilisateurId: vendeurId, // This will be the admin's ID
      titre,
      message,
      type: 'ARTICLE_SUBMISSION',
      articleId
    });
  }
}