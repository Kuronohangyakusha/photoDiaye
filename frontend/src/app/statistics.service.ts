import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Statistics {
  totalArticles: number;
  totalUsers: number;
  totalViews: number;
  totalReports: number;
  misAJourLe: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:3000/api/statistiques';

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<Statistics> {
    let headers = new HttpHeaders();
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return this.http.get<Statistics>(this.apiUrl, { headers });
  }
}