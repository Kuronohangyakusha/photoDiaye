import { ArticleRepository } from "../repository/article.repository.js";
import { NotificationService } from "./notification.service.js";
import { UtilisateurService } from "./utilisateur.service.js";

const articleRepo = new ArticleRepository();
const notificationService = new NotificationService();
const utilisateurService = new UtilisateurService();

export class ArticleService {
  async create(data: any) {
    // Validation des données
    if (!data.titre || !data.prix || !data.vendeurId) {
      throw new Error("Titre, prix et vendeurId sont requis");
    }

    if (data.prix <= 0) {
      throw new Error("Le prix doit être positif");
    }

    // Calculer la date d'expiration (7 jours)
    const expireLe = new Date();
    expireLe.setDate(expireLe.getDate() + 7);

    const articleData = {
      ...data,
      expireLe,
      statut: "EN_ATTENTE"
    };

    const article = await articleRepo.create(articleData);

    // Créer des notifications pour tous les administrateurs
    try {
      await this.notifyAdminsOfNewArticle(article);
    } catch (error) {
      console.error('Erreur lors de la création des notifications admin:', error);
      // Ne pas échouer l'opération si les notifications échouent
    }

    return article;
  }

  async getAll() {
    return articleRepo.findAll();
  }

  async getById(id: string) {
    return articleRepo.findById(id);
  }

  async getByVendeur(vendeurId: string) {
    return articleRepo.findByVendeur(vendeurId);
  }

  async update(id: string, data: any) {
    return articleRepo.update(id, data);
  }

  async delete(id: string) {
    return articleRepo.delete(id);
  }

  async incrementVues(articleId: string) {
    return articleRepo.incrementVues(articleId);
  }

  async getAllPending() {
    return articleRepo.findAllPending();
  }

  async getAllForAdmin(limit: number = 10, offset: number = 0, search: string = '') {
    const [articles, total] = await Promise.all([
      articleRepo.findAllForAdmin(limit, offset, search),
      articleRepo.countAllForAdmin(search)
    ]);

    return { articles, total };
  }

  async approveArticle(id: string) {
    // Récupérer l'article pour les informations du vendeur
    const article = await this.getById(id);
    if (!article) {
      throw new Error("Article non trouvé");
    }

    // Approuver l'article
    const approvedArticle = await articleRepo.approveArticle(id);

    // Créer une notification pour le vendeur
    try {
      await notificationService.createApprovalNotification(article.vendeurId, id, article.titre);
    } catch (error) {
      console.error('Erreur lors de la création de la notification d\'approbation:', error);
      // Ne pas échouer l'opération si la notification échoue
    }

    return approvedArticle;
  }

  async rejectArticle(id: string, motifRejet: string) {
    // Récupérer l'article pour obtenir les informations du vendeur
    const article = await this.getById(id);
    if (!article) {
      throw new Error("Article non trouvé");
    }

    // Rejeter l'article
    const rejectedArticle = await articleRepo.rejectArticle(id, motifRejet);

    // Envoyer une notification au vendeur (SMS ou email)
    try {
      await this.sendRejectionNotification(article, motifRejet);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de rejet:', error);
      // Ne pas échouer l'opération si la notification échoue
    }

    return rejectedArticle;
  }

  async getExpiredArticles() {
    return articleRepo.findExpiredArticles();
  }

  async markArticleForDeletion(id: string) {
    return articleRepo.markForDeletion(id);
  }

  async confirmArticleDeletion(id: string) {
    return articleRepo.confirmDeletion(id);
  }

  async processExpiredArticles() {
    const expiredArticles = await this.getExpiredArticles();

    for (const article of expiredArticles) {
      // Marquer l'article comme expiré
      await this.markArticleForDeletion(article.id);

      // Envoyer une notification au vendeur pour confirmation
      await this.sendExpirationNotification(article);
    }

    return expiredArticles;
  }

  async cleanupOldArticles(days: number = 7) {
    return articleRepo.deleteOldArticles(days);
  }

  private async sendExpirationNotification(article: any) {
    const vendeur = article.vendeur;
    const message = `Bonjour ${vendeur.nom || 'Vendeur'},

Votre article "${article.titre}" est en attente de validation depuis plus de 7 jours.

Pour éviter la suppression automatique, veuillez confirmer si vous souhaitez :
1. Garder l'article en attente
2. Supprimer définitivement l'article

Répondez à ce SMS avec "GARDER" ou "SUPPRIMER".

Si aucune réponse n'est reçue dans 24h, l'article sera automatiquement supprimé.

Cordialement,
L'équipe PhotoDiay`;

    // Pour l'instant, on simule l'envoi d'un SMS
    console.log(`📱 SMS d'expiration envoyé à ${vendeur.telephone}:`);
    console.log(message);

    // Créer aussi une notification en base de données
    try {
      await notificationService.createExpirationNotification(vendeur.id, article.id, article.titre);
    } catch (error) {
      console.error('Erreur lors de la création de la notification d\'expiration:', error);
    }

    // TODO: Implémenter l'envoi réel d'SMS via un service tiers
    // await smsService.send(vendeur.telephone, message);
  }

  private async sendRejectionNotification(article: any, motifRejet: string) {
    const vendeur = article.vendeur;
    const message = `Bonjour ${vendeur.nom || 'Vendeur'},

Votre article "${article.titre}" a été rejeté par l'administrateur.

Motif du rejet: ${motifRejet}

Vous pouvez modifier votre article et le soumettre à nouveau pour validation.

Cordialement,
L'équipe PhotoDiay`;

    // Pour l'instant, on simule l'envoi d'un SMS
    // Dans un environnement réel, on utiliserait un service comme Twilio, OVH Telecom, etc.
    console.log(`📱 SMS envoyé à ${vendeur.telephone}:`);
    console.log(message);

    // TODO: Implémenter l'envoi réel d'SMS via un service tiers
    // Exemple avec un service SMS:
    // await smsService.send(vendeur.telephone, message);

    // Pour l'instant, on stocke aussi la notification dans la base de données
    // pour qu'elle soit visible sur la plateforme
    try {
      await this.createNotificationForVendeur(vendeur.id, article.id, motifRejet, article.titre);
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }
  }

  private async createNotificationForVendeur(vendeurId: string, articleId: string, motifRejet: string, articleTitre: string) {
    try {
      await notificationService.createRejectionNotification(vendeurId, articleId, motifRejet, articleTitre);
    } catch (error) {
      console.error('Erreur lors de la création de la notification de rejet:', error);
    }
  }

  private async notifyAdminsOfNewArticle(article: any) {
    try {
      // Récupérer tous les administrateurs
      const admins = await utilisateurService.getAdmins();

      // Créer une notification pour chaque administrateur
      for (const admin of admins) {
        try {
          await notificationService.createArticleSubmissionNotification(
            admin.id,
            article.id,
            article.titre,
            article.vendeur?.nom || 'Vendeur'
          );
        } catch (error) {
          console.error(`Erreur lors de la création de la notification pour l'admin ${admin.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des administrateurs:', error);
    }
  }
}
