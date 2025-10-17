import { Router } from "express";
import { AuthController } from "./controller/auth.controller.js";
import { UtilisateurController } from "./controller/utilisateur.controller.js";
import { ArticleController } from "./controller/article.controller.js";
import { VueController } from "./controller/vue.controller.js";
import { FavoriController } from "./controller/favori.controller.js";
import { SignalementController } from "./controller/signalement.controller.js";
import { StatistiquesController } from "./controller/statistiques.controller.js";
import { authenticate } from "./middlewares/auth.middleware.js";
const router = Router();
// Controllers
const authController = new AuthController();
const utilisateurController = new UtilisateurController();
const articleController = new ArticleController();
const vueController = new VueController();
const favoriController = new FavoriController();
const signalementController = new SignalementController();
const statsController = new StatistiquesController();
/* ================= AUTH ================= */
router.post("/auth/register", (req, res) => authController.register(req, res));
router.post("/auth/login", (req, res) => authController.login(req, res));
/* ================= UTILISATEUR ================= */
router.get("/utilisateurs", authenticate, (req, res) => utilisateurController.getAll(req, res));
router.get("/utilisateurs/:id", authenticate, (req, res) => utilisateurController.getById(req, res));
router.put("/utilisateurs/:id", authenticate, (req, res) => utilisateurController.update(req, res));
router.delete("/utilisateurs/:id", authenticate, (req, res) => utilisateurController.delete(req, res));
/* ================= ARTICLES ================= */
router.get("/articles", (req, res) => articleController.getAll(req, res));
router.get("/articles/:id", (req, res) => articleController.getById(req, res));
router.get("/articles/vendeur/:vendeurId", (req, res) => articleController.getByVendeur(req, res));
router.post("/articles", authenticate, (req, res) => articleController.create(req, res));
router.put("/articles/:id", authenticate, (req, res) => articleController.update(req, res));
router.delete("/articles/:id", authenticate, (req, res) => articleController.delete(req, res));
router.post("/articles/:id/vue", (req, res) => articleController.incrementVues(req, res));
// Routes admin pour la validation
router.get("/admin/articles/pending", authenticate, (req, res) => articleController.getAllPending(req, res));
router.get("/admin/articles", authenticate, (req, res) => articleController.getAllForAdmin(req, res));
router.put("/admin/articles/:id/approve", authenticate, (req, res) => articleController.approveArticle(req, res));
router.put("/admin/articles/:id/reject", authenticate, (req, res) => articleController.rejectArticle(req, res));
/* ================= VUES ================= */
router.post("/vues", (req, res) => vueController.addVue(req, res));
router.get("/vues/article/:articleId", (req, res) => vueController.getByArticle(req, res));
/* ================= FAVORIS ================= */
router.post("/favoris", authenticate, (req, res) => favoriController.addFavori(req, res));
router.get("/favoris/utilisateur/:utilisateurId", authenticate, (req, res) => favoriController.getByUtilisateur(req, res));
router.delete("/favoris/:utilisateurId/:articleId", authenticate, (req, res) => favoriController.removeFavori(req, res));
/* ================= SIGNALEMENTS ================= */
router.post("/signalements", authenticate, (req, res) => signalementController.addSignalement(req, res));
router.get("/signalements", authenticate, (req, res) => signalementController.getAll(req, res));
router.get("/signalements/article/:articleId", authenticate, (req, res) => signalementController.getByArticle(req, res));
router.delete("/signalements/:id", authenticate, (req, res) => signalementController.delete(req, res));
/* ================= STATISTIQUES ================= */
router.get("/statistiques", authenticate, (req, res) => statsController.getLatest(req, res));
router.post("/statistiques", authenticate, (req, res) => statsController.create(req, res));
router.put("/statistiques/:id", authenticate, (req, res) => statsController.update(req, res));
export default router;
//# sourceMappingURL=routes.js.map