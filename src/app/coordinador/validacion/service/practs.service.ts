import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PracticantePendiente } from "../../comienzoppp/models/PracticantePendiente";

@Injectable({
  providedIn: 'root'
})
export class PractsService {

  private readonly API_URL = 'http://localhost:8080/pppcordinador';

  constructor(private http: HttpClient) {}

  getPracticantesPendientes(): Observable<PracticantePendiente[]> {
    return this.http.get<PracticantePendiente[]>(`${this.API_URL}/pendientes`);
  }


  aprobarPracticante(id: number): Observable<any> {
    return this.http.post(`${this.API_URL}/aprobar/${id}`, {});
  }

  rechazarPracticante(id: number): Observable<any> {
    return this.http.post(`${this.API_URL}/rechazar/${id}`, {});
  }
}
