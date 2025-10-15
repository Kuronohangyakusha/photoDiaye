import express from "express";
import cors from "cors";
import router from "./routes.js";
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware CORS
app.use(cors({
    origin: ["http://localhost:4200", "http://localhost:4201", "http://localhost:4202"], // URLs de votre frontend Angular
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware pour parser le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Servir les fichiers statiques depuis le dossier uploads
app.use('/uploads', express.static('uploads'));
// Routes API
app.use("/api", router);
// Route racine
app.get("/", (req, res) => {
    res.send("Hello World!");
});
// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map