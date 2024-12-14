import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

export interface Application {
  id: number;
  vacancy: {
    id: number;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:8080/api/application';
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}`
  });

  constructor(private http: HttpClient) {}

  getUserApplications(userId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/user/${userId}`, { headers: this.headers });
  }

  getVacancyApplications(vacancyId: number): Observable<{name: string; login: string;}[]> {
    return this.http.get<{name: string; login: string;}[]>(`${this.apiUrl}/${vacancyId}/applications/users`, { headers: this.headers });
  }
}
