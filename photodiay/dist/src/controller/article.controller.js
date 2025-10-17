import { ArticleService } from "../service/article.service.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'article-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Seuls les fichiers image sont autorisés'));
        }
    }
});
const articleService = new ArticleService();
export class ArticleController {
    async create(req, res) {
        try {
            // Récupérer l'utilisateur depuis le token
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non authentifié" });
            }
            // Utiliser multer pour traiter l'upload de fichier
            upload.single('image')(req, res, async (err) => {
                if (err) {
                    console.error('Erreur upload:', err);
                    return res.status(400).json({ error: err.message });
                }
                // Construire l'URL de l'image
                let imageUrl = req.body.urlImage || `/images/article-${Date.now()}.jpg`;
                if (req.file) {
                    imageUrl = `/uploads/${req.file.filename}`;
                }
                // Préparer les données avec l'utilisateur connecté
                const articleData = {
                    titre: req.body.titre,
                    prix: parseFloat(req.body.prix),
                    description: req.body.description || null,
                    categorie: req.body.categorie || null,
                    urlImage: imageUrl,
                    vendeurId: user.id,
                    vendeurTelephone: user.telephone,
                    photoPriseAvecApp: req.body.photoPriseAvecApp === 'true' || req.body.photoPriseAvecApp === true
                };
                console.log('Article data:', articleData);
                console.log('User:', user);
                const article = await articleService.create(articleData);
                res.json(article);
            });
        }
        catch (error) {
            console.error('Erreur lors de la création d\'article:', error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
    async createOld(req, res) {
        try {
            // Récupérer l'utilisateur depuis le token
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: "Utilisateur non authentifié" });
            }
            // Préparer les données avec l'utilisateur connecté
            const articleData = {
                ...req.body,
                vendeurId: user.id,
                vendeurTelephone: user.telephone,
                photoPriseAvecApp: true // Toujours true selon les règles métier
            };
            console.log('Article data:', articleData);
            console.log('User:', user);
            const article = await articleService.create(articleData);
            res.json(article);
        }
        catch (error) {
            console.error('Erreur lors de la création d\'article:', error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
    async getAll(req, res) {
        const articles = await articleService.getAll();
        res.json(articles);
    }
    async getById(req, res) {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "ID requis" });
        }
        const article = await articleService.getById(id);
        res.json(article);
    }
    async getByVendeur(req, res) {
        const vendeurId = req.params.vendeurId;
        if (!vendeurId) {
            return res.status(400).json({ error: "ID vendeur requis" });
        }
        const articles = await articleService.getByVendeur(vendeurId);
        res.json(articles);
    }
    async update(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: "ID requis" });
            }
            // Utiliser multer pour traiter l'upload de fichier
            upload.single('image')(req, res, async (err) => {
                if (err) {
                    console.error('Erreur upload:', err);
                    return res.status(400).json({ error: err.message });
                }
                // Construire l'URL de l'image
                let imageUrl = req.body.urlImage || `/images/article-${Date.now()}.jpg`;
                if (req.file) {
                    imageUrl = `/uploads/${req.file.filename}`;
                }
                // Préparer les données de mise à jour
                const updateData = {};
                if (req.body.titre !== undefined)
                    updateData.titre = req.body.titre;
                if (req.body.prix !== undefined)
                    updateData.prix = parseFloat(req.body.prix);
                if (req.body.description !== undefined)
                    updateData.description = req.body.description || null;
                if (req.body.categorie !== undefined)
                    updateData.categorie = req.body.categorie || null;
                if (imageUrl)
                    updateData.urlImage = imageUrl;
                if (req.body.photoPriseAvecApp !== undefined)
                    updateData.photoPriseAvecApp = req.body.photoPriseAvecApp === 'true' || req.body.photoPriseAvecApp === true;
                console.log('Update data:', updateData);
                const article = await articleService.update(id, updateData);
                res.json(article);
            });
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour d\'article:', error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
    async delete(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: "ID requis" });
            }
            await articleService.delete(id);
            res.json({ message: "Article supprimé" });
        }
        catch (error) {
            console.error('Erreur lors de la suppression d\'article:', error);
            if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
                return res.status(404).json({ error: "Article non trouvé" });
            }
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
    async incrementVues(req, res) {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "ID requis" });
        }
        try {
            // Récupérer l'utilisateur depuis le token (optionnel)
            const user = req.user;
            const utilisateurId = user?.id;
            // Récupérer l'IP du client
            const ip = req.ip || req.connection.remoteAddress || 'unknown';
            // Vérifier si on peut incrémenter la vue
            const vueService = (await import('../service/vue.service.js')).VueService;
            const vueSvc = new vueService();
            const canIncrement = await vueSvc.canIncrementView(id, utilisateurId, ip);
            if (!canIncrement) {
                // Retourner l'article sans incrémenter
                const article = await articleService.getById(id);
                return res.json(article);
            }
            // Incrémenter les vues
            const article = await articleService.incrementVues(id);
            // Enregistrer la vue dans la table vueArticle
            await vueSvc.addVue({
                articleId: id,
                utilisateurId: utilisateurId || null,
                ip: utilisateurId ? null : ip
            });
            res.json(article);
        }
        catch (error) {
            console.error('Erreur lors de l\'incrémentation des vues:', error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
    async getAllPending(req, res) {
        try {
            // Vérifier que l'utilisateur est admin
            const user = req.user;
            if (!user || user.role !== 'ADMIN') {
                return res.status(403).json({ error: "Accès non autorisé" });
            }
            const articles = await articleService.getAllPending();
            res.json(articles);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des articles en attente:', error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
    async getAllForAdmin(req, res) {
        try {
            // Vérifier que l'utilisateur est admin
            const user = req.user;
            if (!user || user.role !== 'ADMIN') {
                return res.status(403).json({ error: "Accès non autorisé" });
            }
            const articles = await articleService.getAllForAdmin();
            res.json(articles);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des articles pour admin:', error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
    async approveArticle(req, res) {
        try {
            // Vérifier que l'utilisateur est admin
            const user = req.user;
            if (!user || user.role !== 'ADMIN') {
                return res.status(403).json({ error: "Accès non autorisé" });
            }
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: "ID requis" });
            }
            // Vérifier que l'article n'est pas déjà approuvé
            const existingArticle = await articleService.getById(id);
            if (!existingArticle) {
                return res.status(404).json({ error: "Article non trouvé" });
            }
            if (existingArticle.statut === 'ACTIF') {
                return res.status(400).json({ error: "L'article est déjà approuvé" });
            }
            const article = await articleService.approveArticle(id);
            res.json(article);
        }
        catch (error) {
            console.error('Erreur lors de l\'approbation d\'article:', error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
    async rejectArticle(req, res) {
        try {
            // Vérifier que l'utilisateur est admin
            const user = req.user;
            if (!user || user.role !== 'ADMIN') {
                return res.status(403).json({ error: "Accès non autorisé" });
            }
            const id = req.params.id;
            const { motifRejet } = req.body;
            if (!id) {
                return res.status(400).json({ error: "ID requis" });
            }
            if (!motifRejet || motifRejet.trim().length === 0) {
                return res.status(400).json({ error: "Le motif de rejet est requis" });
            }
            // Vérifier que l'article n'est pas déjà rejeté
            const existingArticle = await articleService.getById(id);
            if (!existingArticle) {
                return res.status(404).json({ error: "Article non trouvé" });
            }
            if (existingArticle.statut === 'REFUSE') {
                return res.status(400).json({ error: "L'article est déjà rejeté" });
            }
            const article = await articleService.rejectArticle(id, motifRejet.trim());
            res.json(article);
        }
        catch (error) {
            console.error('Erreur lors du rejet d\'article:', error);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
}
//# sourceMappingURL=article.controller.js.map