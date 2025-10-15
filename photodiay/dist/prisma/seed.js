import { PrismaClient, Role, StatutArticle } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    console.log('🌱 Début du seeding...');
    // Créer un administrateur
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.utilisateur.upsert({
        where: { email: 'admin@photodiay.com' },
        update: {},
        create: {
            email: 'admin@photodiay.com',
            motDePasse: adminPassword,
            nom: 'Administrateur',
            telephone: '+221770000000',
            role: Role.ADMIN,
            estVip: true,
        },
    });
    console.log('✅ Administrateur créé:', admin.email);
    // Créer des vendeurs
    const vendeurs = [];
    for (let i = 1; i <= 20; i++) {
        const password = await bcrypt.hash(`vendeur${i}123`, 10);
        const vendeur = await prisma.utilisateur.upsert({
            where: { email: `vendeur${i}@example.com` },
            update: {},
            create: {
                email: `vendeur${i}@example.com`,
                motDePasse: password,
                nom: `Vendeur ${i}`,
                telephone: `+22177${String(i).padStart(6, '0')}000`,
                role: Role.VENDEUR,
                estVip: i <= 2, // Les 2 premiers sont VIP
            },
        });
        vendeurs.push(vendeur);
    }
    console.log('✅ Vendeurs créés:', vendeurs.length);
    // Créer des acheteurs
    const acheteurs = [];
    for (let i = 1; i <= 20; i++) {
        const password = await bcrypt.hash(`acheteur${i}123`, 10);
        const acheteur = await prisma.utilisateur.upsert({
            where: { email: `acheteur${i}@example.com` },
            update: {},
            create: {
                email: `acheteur${i}@example.com`,
                motDePasse: password,
                nom: `Acheteur ${i}`,
                telephone: `+22178${String(i).padStart(6, '0')}000`,
                role: Role.ACHETEUR,
            },
        });
        acheteurs.push(acheteur);
    }
    console.log('✅ Acheteurs créés:', acheteurs.length);
    // Créer des articles
    const categories = ['Électronique', 'Vêtements', 'Maison', 'Véhicules', 'Immobilier', 'Loisirs'];
    const articles = [];
    for (let i = 1; i <= 100; i++) {
        const vendeur = vendeurs[Math.floor(Math.random() * vendeurs.length)];
        const categorie = categories[Math.floor(Math.random() * categories.length)];
        const prix = Math.floor(Math.random() * 1000000) + 10000; // Entre 10k et 1M FCFA
        const expireLe = new Date();
        expireLe.setDate(expireLe.getDate() + 7); // Expire dans 7 jours
        const article = await prisma.article.create({
            data: {
                vendeurId: vendeur.id,
                vendeurTelephone: vendeur.telephone,
                titre: `Article ${i} - ${categorie}`,
                description: `Description détaillée de l'article ${i}. C'est un produit de qualité en ${categorie.toLowerCase()}.`,
                prix: prix,
                categorie: categorie,
                urlImage: `/images/article${i}.jpg`,
                photoPriseAvecApp: true,
                statut: i % 4 === 0 ? StatutArticle.VENDU : StatutArticle.ACTIF, // 1/4 des articles sont vendus
                expireLe: expireLe,
                nombreVues: Math.floor(Math.random() * 100),
                nombreInteractions: Math.floor(Math.random() * 50),
            },
        });
        articles.push(article);
    }
    console.log('✅ Articles créés:', articles.length);
    // Créer des vues d'articles
    for (const article of articles) {
        const nombreVues = Math.floor(Math.random() * 10) + 1;
        for (let j = 0; j < nombreVues; j++) {
            const utilisateur = Math.random() > 0.5 ? acheteurs[Math.floor(Math.random() * acheteurs.length)] : null;
            await prisma.vueArticle.create({
                data: {
                    articleId: article.id,
                    utilisateurId: utilisateur?.id || null,
                    ip: utilisateur ? null : `192.168.1.${Math.floor(Math.random() * 255)}`,
                },
            });
        }
    }
    console.log('✅ Vues d\'articles créées');
    // Créer des favoris
    for (const acheteur of acheteurs) {
        const nombreFavoris = Math.floor(Math.random() * 5) + 1;
        const articlesFavoris = articles.sort(() => 0.5 - Math.random()).slice(0, nombreFavoris);
        for (const article of articlesFavoris) {
            await prisma.favori.create({
                data: {
                    utilisateurId: acheteur.id,
                    articleId: article.id,
                },
            });
        }
    }
    console.log('✅ Favoris créés');
    // Créer des signalements
    const raisons = ['Contenu inapproprié', 'Article déjà vendu', 'Prix incorrect', 'Description fausse'];
    for (let i = 0; i < 20; i++) {
        const article = articles[Math.floor(Math.random() * articles.length)];
        const auteur = acheteurs[Math.floor(Math.random() * acheteurs.length)];
        const raison = raisons[Math.floor(Math.random() * raisons.length)];
        await prisma.signalement.create({
            data: {
                articleId: article.id,
                auteurId: auteur.id,
                raison: raison,
                description: `Signalement de l'article "${article.titre}" pour raison: ${raison}`,
            },
        });
    }
    console.log('✅ Signalements créés');
    // Créer les statistiques admin
    const totalArticles = await prisma.article.count();
    const totalUtilisateurs = await prisma.utilisateur.count();
    const totalVues = await prisma.vueArticle.count();
    await prisma.statistiquesAdmin.create({
        data: {
            totalArticles,
            totalUtilisateurs,
            totalVues,
        },
    });
    console.log('✅ Statistiques admin créées');
    console.log('🎉 Seeding terminé avec succès!');
    console.log('\n📋 Comptes de test créés:');
    console.log('Admin: admin@photodiay.com / admin123');
    vendeurs.forEach((v, i) => {
        console.log(`Vendeur ${i + 1}: vendeur${i + 1}@example.com / vendeur${i + 1}123`);
    });
    acheteurs.forEach((a, i) => {
        console.log(`Acheteur ${i + 1}: acheteur${i + 1}@example.com / acheteur${i + 1}123`);
    });
}
main()
    .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map