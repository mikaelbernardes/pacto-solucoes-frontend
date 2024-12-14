import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Vacancy {
  id: number;
  title: string;
  description: string;
  status: string;
  requirements: string[];
  user: {
    id: number;
  }
}

@Injectable({
  providedIn: 'root'
})
export class VacancysService {
  private apiUrl = 'http://localhost:8080/api/vacancy';
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}`
  });

  constructor(private http: HttpClient) {}

  getAllVacancies(): Observable<Vacancy[]> {
    return this.http.get<Vacancy[]>(this.apiUrl, { headers: this.headers });
  }

  getVacanciesByRecruiterId(userId: number): Observable<Vacancy[]> {
    return this.http.get<Vacancy[]>(`${this.apiUrl}/recruiter/${userId}`, { headers: this.headers });
  }

  getVacancyById(id: number): Observable<Vacancy> {
    return this.http.get<Vacancy>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  createVacancy(vacancy: Omit<Vacancy, 'id'>): Observable<Vacancy> {
    return this.http.post<Vacancy>(this.apiUrl + "/register", vacancy, { headers: this.headers });
  }

  updateVacancy(id: number, vacancy: Omit<Vacancy, 'id'>): Observable<Vacancy> {
    return this.http.put<Vacancy>(`${this.apiUrl}/${id}`, vacancy, { headers: this.headers });
  }

  deleteVacancy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }
}
