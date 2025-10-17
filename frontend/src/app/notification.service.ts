import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: string;
  utilisateurId: string;
  titre: string;
  message: string;
  type: string;
  articleId?: string;
  lue: boolean;
  creeLe: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getNotifications(utilisateurId: string, limit: number = 50): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.apiUrl}/notifications/${utilisateurId}?limit=${limit}`,
      { headers: this.getHeaders() }
    );
  }

  getUnreadNotifications(utilisateurId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.apiUrl}/notifications/${utilisateurId}/unread`,
      { headers: this.getHeaders() }
    );
  }

  getUnreadCount(utilisateurId: string): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      `${this.apiUrl}/notifications/${utilisateurId}/unread-count`,
      { headers: this.getHeaders() }
    );
  }

  markAsRead(notificationId: string, utilisateurId: string): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(
      `${this.apiUrl}/notifications/${notificationId}/read`,
      { utilisateurId },
      { headers: this.getHeaders() }
    );
  }

  markAllAsRead(utilisateurId: string): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(
      `${this.apiUrl}/notifications/${utilisateurId}/read-all`,
      { utilisateurId },
      { headers: this.getHeaders() }
    );
  }

  deleteNotification(notificationId: string, utilisateurId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `${this.apiUrl}/notifications/${notificationId}`,
      {
        headers: this.getHeaders(),
        body: { utilisateurId }
      }
    );
  }
}