import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService, Article } from './article.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  searchQuery: string = '';

 
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  // Advanced Search
  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: string = 'publieLe';
  sortOrder: 'asc' | 'desc' = 'desc';
  availableCategories: string[] = [];

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getAllArticles().subscribe({
      next: (data) => {
        // Corriger les URLs d'images pour pointer vers l'API backend
        this.articles = data.map(article => ({
          ...article,
          urlImage: article.urlImage.startsWith('/uploads/')
            ? `http://localhost:3000${article.urlImage}`
            : article.urlImage.startsWith('/images/')
            ? `http://localhost:3000${article.urlImage}`
            : article.urlImage
        }));
        this.extractCategories(this.articles);
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles:', error);
      }
    });
  }

  extractCategories(articles: Article[]): void {
    const categories = new Set<string>();
    articles.forEach(article => {
      if (article.categorie) {
        categories.add(article.categorie);
      }
    });
    this.availableCategories = Array.from(categories).sort();
  }

  applyFilters(): void {
    let filtered = [...this.articles];

    // Text search
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(article =>
        article.titre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (article.description && article.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(article => article.categorie === this.selectedCategory);
    }

    // Price range filter
    if (this.minPrice !== null) {
      filtered = filtered.filter(article => article.prix >= this.minPrice!);
    }
    if (this.maxPrice !== null) {
      filtered = filtered.filter(article => article.prix <= this.maxPrice!);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (this.sortBy) {
        case 'prix':
          aValue = a.prix;
          bValue = b.prix;
          break;
        case 'publieLe':
          aValue = new Date(a.publieLe).getTime();
          bValue = new Date(b.publieLe).getTime();
          break;
        case 'nombreVues':
          aValue = a.nombreVues;
          bValue = b.nombreVues;
          break;
        case 'titre':
          aValue = a.titre.toLowerCase();
          bValue = b.titre.toLowerCase();
          break;
        default:
          return 0;
      }

      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    this.filteredArticles = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onPriceFilter(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = 'publieLe';
    this.sortOrder = 'desc';
    this.applyFilters();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredArticles.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  get paginatedArticles(): Article[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredArticles.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  goToSell(): void {
    if (this.router) {
      this.router.navigate(['/register-seller']);
    }
  }

  goToLogin(): void {
    if (this.router) {
      this.router.navigate(['/login']);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  }

  goToDetail(articleId: string): void {
    this.router.navigate(['/article', articleId]);
  }
}