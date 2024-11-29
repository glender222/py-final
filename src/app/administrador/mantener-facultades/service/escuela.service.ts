import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Escuela } from '../models/escuela';

@Injectable({
  providedIn: 'root'
})
export class EscuelaService {
  private readonly API_URL = 'http://localhost:8080/mantener';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getEscuelasByFacultad(facultadId: number): Observable<Escuela[]> {
    return this.http.get<Escuela[]>(`${this.API_URL}/escuela/facultad/${facultadId}`, this.getHeaders());
  }

  createEscuela(escuela: Escuela): Observable<Escuela> {
    return this.http.post<Escuela>(`${this.API_URL}/escuela`, escuela, this.getHeaders());
  }

  updateEscuela(escuela: Escuela): Observable<Escuela> {
    return this.http.put<Escuela>(`${this.API_URL}/escuela/${escuela.id}`, escuela, this.getHeaders());
  }

  deleteEscuela(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/escuela/${id}`, this.getHeaders());
  }

  getAllEscuelas(): Observable<Escuela[]> {
    return this.http.get<Escuela[]>(`${this.API_URL}/escuela`, this.getHeaders());
  }
}
