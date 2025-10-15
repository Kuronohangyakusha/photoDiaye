import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { StatisticsService, Statistics } from './statistics.service';
import { HttpClientModule } from '@angular/common/http';

interface AdminStatistics {
  totalArticles: number;
  totalUtilisateurs: number;
  totalVues: number;
  totalReports?: number;
  misAJourLe: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  statistics: AdminStatistics | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  activeSection: string = 'dashboard';

  constructor(
    private authService: AuthService,
    private statisticsService: StatisticsService,
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

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  isActiveSection(section: string): boolean {
    return this.activeSection === section;
  }
}