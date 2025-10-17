import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Article {
  id: string;
  titre: string;
  description?: string;
  prix: number;
  categorie?: string;
  urlImage: string;
  statut: string;
  publieLe: string;
  nombreVues: number;
  vendeur: {
    id: string;
    nom?: string;
    telephone: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:3000/api/articles'; // Ajuster selon votre configuration

  constructor(private http: HttpClient) {}

  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  searchArticles(query: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}?search=${encodeURIComponent(query)}`);
  }

  getArticlesByCategory(category: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}?categorie=${encodeURIComponent(category)}`);
  }

  getArticlesByPriceRange(minPrice?: number, maxPrice?: number): Observable<Article[]> {
    let params = '';
    if (minPrice !== undefined) params += `prixMin=${minPrice}&`;
    if (maxPrice !== undefined) params += `prixMax=${maxPrice}&`;
    params = params.slice(0, -1); // Remove last &
    return this.http.get<Article[]>(`${this.apiUrl}?${params}`);
  }

  getArticlesBySeller(sellerId: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/vendeur/${sellerId}`);
  }

  createArticle(articleData: any, token: string): Observable<Article> {
    const formData = new FormData();

    // Ajouter les données texte
    Object.keys(articleData).forEach(key => {
      if (key !== 'imageFile') {
        formData.append(key, articleData[key]);
      }
    });

    // Ajouter l'image si elle existe
    if (articleData.imageFile) {
      formData.append('image', articleData.imageFile);
    }

    return this.http.post<Article>(this.apiUrl, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
        // Ne pas définir Content-Type pour FormData, il sera défini automatiquement
      }
    });
  }

  updateArticle(articleId: string, articleData: any, token: string): Observable<Article> {
    const formData = new FormData();

    // Ajouter les données texte
    Object.keys(articleData).forEach(key => {
      if (key !== 'imageFile') {
        formData.append(key, articleData[key]);
      }
    });

    // Ajouter l'image si elle existe
    if (articleData.imageFile) {
      formData.append('image', articleData.imageFile);
    }

    return this.http.put<Article>(`${this.apiUrl}/${articleId}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`
        // Ne pas définir Content-Type pour FormData, il sera défini automatiquement
      }
    });
  }

  deleteArticle(articleId: string, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${articleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  incrementViews(articleId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${articleId}/vue`, {});
  }

  getAllPending(token: string): Observable<Article[]> {
    return this.http.get<Article[]>('http://localhost:3000/api/admin/articles/pending', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  approveArticle(articleId: string, token: string): Observable<Article> {
    return this.http.put<Article>(`http://localhost:3000/api/admin/articles/${articleId}/approve`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  rejectArticle(articleId: string, token: string, motifRejet: string): Observable<Article> {
    return this.http.put<Article>(`http://localhost:3000/api/admin/articles/${articleId}/reject`, { motifRejet }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  getAllForAdmin(token: string, page: number = 1, limit: number = 10, search: string = ''): Observable<{ articles: Article[]; pagination: { total: number; totalPages: number; currentPage: number; limit: number } }> {
    let url = `http://localhost:3000/api/admin/articles?page=${page}&limit=${limit}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<{ articles: Article[]; pagination: { total: number; totalPages: number; currentPage: number; limit: number } }>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
}