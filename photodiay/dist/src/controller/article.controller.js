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
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "ID requis" });
        }
        const article = await articleService.update(id, req.body);
        res.json(article);
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
        const article = await articleService.incrementVues(id);
        res.json(article);
    }
}
//# sourceMappingURL=article.controller.js.map