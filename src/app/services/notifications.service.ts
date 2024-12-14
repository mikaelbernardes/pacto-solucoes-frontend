import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = 'http://localhost:8080/api/notifications';
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}`
  });

  constructor(private http: HttpClient) {}

  getUserNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/${userId}`, { headers: this.headers });
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-as-read/${notificationId}`, {}, { headers: this.headers });
  }
}
