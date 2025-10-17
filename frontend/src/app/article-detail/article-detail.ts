import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ArticleService, Article } from '../article.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.css'
})
export class ArticleDetail implements OnInit {
  article: Article | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadArticle(id);
    } else {
      this.errorMessage = 'ID d\'article manquant';
      this.isLoading = false;
    }
  }

  loadArticle(id: string): void {
    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        // Corriger les URLs d'images pour pointer vers l'API backend
        this.article = {
          ...article,
          urlImage: article.urlImage.startsWith('/uploads/')
            ? `http://localhost:3000${article.urlImage}`
            : article.urlImage.startsWith('/images/')
            ? `http://localhost:3000${article.urlImage}`
            : article.urlImage
        };
        this.isLoading = false;

        // Incrementer les vues après le chargement de l'article
        this.articleService.incrementViews(id).subscribe({
          next: () => {
            console.log('Vue incrémentée pour l\'article:', id);
          },
          error: (error) => {
            console.error('Erreur lors de l\'incrémentation des vues:', error);
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'article:', error);
        this.errorMessage = 'Erreur lors du chargement de l\'article';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  }

  contactSeller(): void {
    if (this.article?.vendeur?.telephone) {
      window.open(`tel:${this.article.vendeur.telephone}`, '_self');
    }
  }
}
