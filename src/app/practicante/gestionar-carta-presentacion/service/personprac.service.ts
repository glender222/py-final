import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CartaPresentacion, CartaResponse } from '../model/cartaprac';

@Injectable({
  providedIn: 'root'
})
export class PersonpracService {
  // Update this URL to match your backend API
  private baseUrl = 'http://localhost:8080/ppp';

  constructor(private http: HttpClient) { }

  public guardarDatos(carta: CartaPresentacion): Observable<CartaResponse> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Asegurarse de que los datos coincidan exactamente con el formato esperado
    const cartaData = {
      razonSocial: carta.razonSocial,
      direccion: carta.direccion,
      ruc: carta.ruc,
      descripcion: carta.descripcion,
      nombreArea: carta.nombreArea,
      descripcionArea: carta.descripcionArea,
      nombreRepresentante: carta.nombreRepresentante,
      apellidoRepresentante: carta.apellidoRepresentante,
      cargoRepresentante: carta.cargoRepresentante,
      telefonoRepresentante: carta.telefonoRepresentante,
      correoRepresentante: carta.correoRepresentante,
      nombreLinea: carta.nombreLinea
    };

    console.log('Datos a enviar:', cartaData); // Para depuración

    return this.http.post<CartaResponse>(`${this.baseUrl}/guardar-datos`, cartaData, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error completo:', error);
          return this.handleError(error);
        })
      );
  }

  public obtenerCarta(): Observable<CartaPresentacion> {
    return this.http.get<CartaPresentacion>(`${this.baseUrl}/micarta`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Intentar obtener el mensaje de error del backend
      errorMessage = error.error?.error || error.error?.mensaje || 'Error en el servidor';
      console.log('Error del servidor:', error.error);
    }
    return throwError(() => errorMessage);
  }
}
