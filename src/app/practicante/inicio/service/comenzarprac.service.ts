import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ComenzarpracService {
  private baseUrl = 'http://localhost:8080/ppp';

  constructor(private http: HttpClient) { }

  comenzarPracticas(): Observable<any> {
    return this.http.post(`${this.baseUrl}/comenzar`, {});
  }
}
