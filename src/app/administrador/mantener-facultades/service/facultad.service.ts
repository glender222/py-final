import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Facultad } from '../models/facultad';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FacultadService {
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

  getFacultadesByCampus(campusId: number): Observable<Facultad[]> {
    return this.getAllFacultades().pipe(
      map(facultades => facultades.filter(f => f.idCampus === campusId))
    );
  }

  createFacultad(facultad: Facultad): Observable<Facultad> {
    return this.http.post<Facultad>(`${this.API_URL}/facultad`, facultad, this.getHeaders());
  }

  updateFacultad(facultad: Facultad): Observable<Facultad> {
    return this.http.put<Facultad>(`${this.API_URL}/facultad/${facultad.id}`, facultad, this.getHeaders());
  }

  deleteFacultad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/facultad/${id}`, this.getHeaders());
  }

  getAllFacultades(): Observable<Facultad[]> {
    return this.http.get<Facultad[]>(`${this.API_URL}/facultad`, this.getHeaders());
  }
}
