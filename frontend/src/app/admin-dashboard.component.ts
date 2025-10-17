import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { StatisticsService, Statistics } from './statistics.service';
import { ArticleService } from './article.service';
import { UserService, User, UsersResponse } from './user.service';
import { NotificationService, Notification } from './notification.service';
import { HttpClientModule } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Register Chart.js components
Chart.register(...registerables);

interface AdminStatistics {
  totalArticles: number;
  totalUtilisateurs: number;
  totalVues: number;
  totalReports?: number;
  misAJourLe: string;
}

interface Article {
  id: string;
  titre: string;
  prix: number;
  statut: string;
  publieLe: string;
  vendeur: {
    id: string;
    nom?: string;
    telephone: string;
  };
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  statistics: AdminStatistics | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  activeSection: string = 'dashboard';
  pendingArticles: Article[] = [];
  allArticles: Article[] = [];
  articlesLoading: boolean = false;
  historyArticles: Article[] = [];
  historyLoading: boolean = false;
  historyCurrentPage: number = 1;
  historyTotalPages: number = 1;
  historyTotal: number = 0;
  historySearchQuery: string = '';
  users: User[] = [];
  usersLoading: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;
  totalUsers: number = 0;
  showRejectModal: boolean = false;
  rejectReason: string = '';
  articleToReject: string = '';

  // Notifications
  notifications: Notification[] = [];
  unreadCount: number = 0;
  showNotifications: boolean = false;

  constructor(
    private authService: AuthService,
    private statisticsService: StatisticsService,
    private articleService: ArticleService,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier l'authentification côté client uniquement
    if (typeof window !== 'undefined' && !this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Vérifier que l'utilisateur est un admin
    if (typeof window !== 'undefined') {
      const token = this.authService.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.role !== 'ADMIN') {
            // Rediriger vers la page d'accueil si ce n'est pas un admin
            this.router.navigate(['/']);
            return;
          }
        } catch (error) {
          console.error('Erreur lors du décodage du token:', error);
          this.router.navigate(['/login']);
          return;
        }
      }
    }

    this.loadStatistics();
    this.loadNotifications();
  }

  ngAfterViewInit(): void {
    // Initialize charts after view is ready
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  private initializeCharts(): void {
    if (typeof window !== 'undefined' && this.statistics) {
      this.createArticlesChart();
      this.createViewsChart();
    }
  }

  private updateCharts(): void {
    if (typeof window !== 'undefined' && this.statistics) {
      // Détruire les graphiques existants
      this.destroyCharts();
      // Recréer les graphiques avec les nouvelles données
      this.createArticlesChart();
      this.createViewsChart();
    }
  }

  private destroyCharts(): void {
    // Détruire les graphiques Chart.js existants
    const articlesChart = Chart.getChart('articlesChart');
    const viewsChart = Chart.getChart('viewsChart');

    if (articlesChart) {
      articlesChart.destroy();
    }
    if (viewsChart) {
      viewsChart.destroy();
    }
  }

  private createArticlesChart(): void {
    const canvas = document.getElementById('articlesChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mock data for demonstration
    const data = {
      labels: ['En attente', 'Actif', 'Vendu', 'Expiré', 'Rejeté'],
      datasets: [{
        label: 'Articles',
        data: [5, 25, 15, 3, 2],
        backgroundColor: [
          '#ffc107', // Jaune pour en attente
          '#28a745', // Vert pour actif
          '#007bff', // Bleu pour vendu
          '#6c757d', // Gris pour expiré
          '#dc3545'  // Rouge pour rejeté
        ],
        borderWidth: 1
      }]
    };

    new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });
  }

  private createViewsChart(): void {
    const canvas = document.getElementById('viewsChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mock data for demonstration
    const data = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Vues d\'articles',
        data: [120, 190, 300, 500, 200, 300],
        borderColor: '#6C0BA9',
        backgroundColor: 'rgba(108, 11, 169, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    };

    new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.05)'
            }
          },
          x: {
            grid: {
              color: 'rgba(0,0,0,0.05)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  loadStatistics(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      this.isLoading = false;
      return;
    }

    this.statisticsService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = {
          totalArticles: stats.totalArticles,
          totalUtilisateurs: stats.totalUsers,
          totalVues: stats.totalViews,
          misAJourLe: stats.misAJourLe
        };
        this.isLoading = false;

        // Mettre à jour les graphiques si on est sur la section dashboard
        if (this.activeSection === 'dashboard') {
          setTimeout(() => {
            this.updateCharts();
          }, 100);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.errorMessage = 'Erreur lors du chargement des statistiques.';
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  loadNotifications(): void {
    if (typeof window === 'undefined') return;

    const token = this.authService.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      // Charger les notifications
      this.notificationService.getNotifications(userId).subscribe({
        next: (notifications) => {
          this.notifications = notifications;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des notifications:', error);
        }
      });

      // Charger le nombre de notifications non lues
      this.notificationService.getUnreadCount(userId).subscribe({
        next: (response) => {
          this.unreadCount = response.count;
        },
        error: (error) => {
          console.error('Erreur lors du chargement du compteur de notifications:', error);
        }
      });
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      // Marquer toutes les notifications comme lues quand on ouvre le panneau
      this.markAllNotificationsAsRead();
    }
  }

  markAllNotificationsAsRead(): void {
    if (typeof window === 'undefined') return;

    const token = this.authService.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      this.notificationService.markAllAsRead(userId).subscribe({
        next: () => {
          this.notifications.forEach(notification => notification.lue = true);
          this.unreadCount = 0;
        },
        error: (error) => {
          console.error('Erreur lors du marquage des notifications comme lues:', error);
        }
      });
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
    }
  }

  deleteNotification(notificationId: string): void {
    if (typeof window === 'undefined') return;

    const token = this.authService.getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      this.notificationService.deleteNotification(notificationId, userId).subscribe({
        next: () => {
          this.notifications = this.notifications.filter(n => n.id !== notificationId);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la notification:', error);
        }
      });
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'ARTICLE_SUBMISSION': return '📦';
      case 'REJET_ARTICLE': return '❌';
      case 'ARTICLE_APPROUVE': return '✅';
      case 'ARTICLE_EXPIRE': return '⏰';
      default: return '🔔';
    }
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    if (section === 'dashboard') {
      // Recharger les statistiques et mettre à jour les graphiques
      this.loadStatistics();
      // Attendre que les statistiques soient chargées puis mettre à jour les graphiques
      setTimeout(() => {
        this.updateCharts();
      }, 500);
    } else if (section === 'articles') {
      this.loadArticles();
    } else if (section === 'users') {
      this.loadUsers();
    } else if (section === 'history') {
      this.loadHistoryArticles();
    }
  }

  isActiveSection(section: string): boolean {
    return this.activeSection === section;
  }

  loadArticles(): void {
    this.articlesLoading = true;
    const token = this.authService.getToken();
    if (!token) return;

    this.articleService.getAllPending(token).subscribe({
      next: (articles: Article[]) => {
        this.pendingArticles = articles;
        this.articlesLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des articles en attente:', error);
        this.articlesLoading = false;
      }
    });
  }

  approveArticle(articleId: string): void {
    const token = this.authService.getToken();
    if (!token) return;

    this.articleService.approveArticle(articleId, token).subscribe({
      next: () => {
        this.pendingArticles = this.pendingArticles.filter(article => article.id !== articleId);
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'approbation:', error);
      }
    });
  }

  openRejectModal(articleId: string): void {
    this.articleToReject = articleId;
    this.rejectReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.rejectReason = '';
    this.articleToReject = '';
  }

  confirmReject(): void {
    if (!this.rejectReason.trim()) return;

    const token = this.authService.getToken();
    if (!token) return;

    this.articleService.rejectArticle(this.articleToReject, token, this.rejectReason.trim()).subscribe({
      next: () => {
        this.pendingArticles = this.pendingArticles.filter(article => article.id !== this.articleToReject);
        this.closeRejectModal();
      },
      error: (error: any) => {
        console.error('Erreur lors du rejet:', error);
      }
    });
  }

  loadUsers(): void {
    this.usersLoading = true;
    const token = this.authService.getToken();
    if (!token) return;

    this.userService.getAllUsers(this.currentPage, 10).subscribe({
      next: (response: UsersResponse) => {
        this.users = response.utilisateurs;
        this.totalPages = response.pagination.totalPages;
        this.totalUsers = response.pagination.total;
        this.usersLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.usersLoading = false;
      }
    });
  }

  changeUserPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  changeHistoryPage(page: number): void {
    if (page >= 1 && page <= this.historyTotalPages) {
      this.historyCurrentPage = page;
      this.loadHistoryArticles();
    }
  }

  searchHistoryArticles(): void {
    this.historyCurrentPage = 1; // Reset to first page when searching
    this.loadHistoryArticles();
  }

  clearHistorySearch(): void {
    this.historySearchQuery = '';
    this.historyCurrentPage = 1;
    this.loadHistoryArticles();
  }

  cleanupOldArticles(): void {
    const token = this.authService.getToken();
    if (!token) return;

    // TODO: Implémenter l'appel à l'API de nettoyage
    // this.http.post('http://localhost:3000/api/admin/articles/cleanup', {}, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // }).subscribe(...)

    // Pour l'instant, juste un message d'information
    console.log('Nettoyage des anciens articles demandé');
  }

  loadHistoryArticles(): void {
    this.historyLoading = true;
    const token = this.authService.getToken();
    if (!token) return;

    this.articleService.getAllForAdmin(token, this.historyCurrentPage, 10, this.historySearchQuery).subscribe({
      next: (response) => {
        this.historyArticles = response.articles;
        this.historyTotalPages = response.pagination.totalPages;
        this.historyTotal = response.pagination.total;
        this.historyLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement de l\'historique des articles:', error);
        this.historyLoading = false;
      }
    });
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== userId);
        this.totalUsers--;
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression:', error);
      }
    });
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'VENDEUR': return 'Vendeur';
      case 'ACHETEUR': return 'Client';
      default: return role;
    }
  }

  getStatusLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'ACTIF': return 'Approuvé';
      case 'REFUSE': return 'Rejeté';
      case 'EXPIRE': return 'Expiré';
      case 'VENDU': return 'Vendu';
      default: return statut;
    }
  }

  generateCompleteReport(): void {
    if (!this.statistics) {
      alert('Les statistiques ne sont pas encore chargées.');
      return;
    }

    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Add title
    pdf.setFontSize(20);
    pdf.setTextColor(108, 11, 169); // Violet
    pdf.text('Rapport PhotoDiaye - Statistiques Complètes', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Add date
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Add statistics summary
    pdf.setFontSize(16);
    pdf.setTextColor(108, 11, 169);
    pdf.text('Résumé des Statistiques', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Total Articles: ${this.statistics.totalArticles}`, 25, yPosition);
    yPosition += 10;
    pdf.text(`Total Utilisateurs: ${this.statistics.totalUtilisateurs}`, 25, yPosition);
    yPosition += 10;
    pdf.text(`Total Vues: ${this.statistics.totalVues}`, 25, yPosition);
    yPosition += 10;
    pdf.text(`Dernière mise à jour: ${new Date(this.statistics.misAJourLe).toLocaleDateString('fr-FR')}`, 25, yPosition);
    yPosition += 20;

    // Add charts section
    pdf.setFontSize(16);
    pdf.setTextColor(108, 11, 169);
    pdf.text('Graphiques et Analyses', 20, yPosition);
    yPosition += 15;

    // Capture charts and add to PDF
    const chartPromises = [
      this.captureChart('articlesChart', 'Répartition des Articles'),
      this.captureChart('viewsChart', 'Évolution des Vues')
    ];

    Promise.all(chartPromises).then((chartImages) => {
      chartImages.forEach((chartData, index) => {
        if (chartData && yPosition + 80 > pageHeight) {
          pdf.addPage();
          yPosition = 20;
        }

        if (chartData) {
          // Add chart title
          pdf.setFontSize(14);
          pdf.setTextColor(108, 11, 169);
          pdf.text(chartData.title, 20, yPosition);
          yPosition += 10;

          // Add chart image
          pdf.addImage(chartData.imageData, 'PNG', 20, yPosition, 170, 60);
          yPosition += 80;
        }
      });

      // Add detailed statistics section
      if (yPosition + 60 > pageHeight) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(16);
      pdf.setTextColor(108, 11, 169);
      pdf.text('Détails par Catégorie', 20, yPosition);
      yPosition += 15;

      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      const categories = ['Électronique', 'Mode', 'Maison', 'Sport', 'Autres'];
      categories.forEach((category, index) => {
        const count = Math.floor(Math.random() * 20) + 5; // Mock data
        pdf.text(`${category}: ${count} articles`, 25, yPosition);
        yPosition += 8;
      });

      // Add footer
      const footerY = pageHeight - 20;
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Rapport généré automatiquement par PhotoDiaye', pageWidth / 2, footerY, { align: 'center' });

      // Save the PDF
      pdf.save(`rapport-photodiaye-${new Date().toISOString().split('T')[0]}.pdf`);
    }).catch((error) => {
      console.error('Erreur lors de la génération du rapport:', error);
      alert('Erreur lors de la génération du rapport PDF.');
    });
  }

  private captureChart(chartId: string, title: string): Promise<{ imageData: string; title: string } | null> {
    return new Promise((resolve) => {
      const canvas = document.getElementById(chartId) as HTMLCanvasElement;
      if (!canvas) {
        resolve(null);
        return;
      }

      html2canvas(canvas, {
        backgroundColor: '#ffffff',
        scale: 2
      }).then((canvas) => {
        const imageData = canvas.toDataURL('image/png');
        resolve({ imageData, title });
      }).catch((error) => {
        console.error(`Erreur lors de la capture du graphique ${chartId}:`, error);
        resolve(null);
      });
    });
  }
}