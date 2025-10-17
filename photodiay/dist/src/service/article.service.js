import { ArticleRepository } from "../repository/article.repository.js";
const articleRepo = new ArticleRepository();
export class ArticleService {
    async create(data) {
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
        return articleRepo.create(articleData);
    }
    async getAll() {
        return articleRepo.findAll();
    }
    async getById(id) {
        return articleRepo.findById(id);
    }
    async getByVendeur(vendeurId) {
        return articleRepo.findByVendeur(vendeurId);
    }
    async update(id, data) {
        return articleRepo.update(id, data);
    }
    async delete(id) {
        return articleRepo.delete(id);
    }
    async incrementVues(articleId) {
        return articleRepo.incrementVues(articleId);
    }
    async getAllPending() {
        return articleRepo.findAllPending();
    }
    async getAllForAdmin() {
        return articleRepo.findAllForAdmin();
    }
    async approveArticle(id) {
        return articleRepo.approveArticle(id);
    }
    async rejectArticle(id, motifRejet) {
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
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi de la notification de rejet:', error);
            // Ne pas échouer l'opération si la notification échoue
        }
        return rejectedArticle;
    }
    async sendRejectionNotification(article, motifRejet) {
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
    }
}
//# sourceMappingURL=article.service.js.map