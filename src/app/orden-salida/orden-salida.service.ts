import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenSalidaService {

  private apiUrl = 'http://localhost:8080/orden/salida';

  constructor(private http:HttpClient) { }

  listarOrdenSalida()  {
    return this.http.get(`${this.apiUrl}/listar`).pipe(
      map((res:any) => {
        
        return res.ordenes;
      }),
      catchError((err) => {
        console.log("Error al listar las ordenes", err);
        return throwError(() => err);
      })
    );
  }
  
  encontrarOrdenSalidaById(id:number)  {
    return this.http.get(`${this.apiUrl}/encontrar/${id}`).pipe(
      map((res:any) => {
        
        return res.orden;
      }),
      catchError((err) => {
        console.log("Error al encontrar la orden de salida", err);
        return throwError(() => err);
      })
    );
  }
  
  crearOrdenSalida(orden:any)  {
    return this.http.post(`${this.apiUrl}/crear`, orden).pipe(
      map((res:any) => {
        console.log(res.message);
        
        return res;
      }),
      catchError((err) => {
        console.log("Error al crear la orden de salida", err);
        return throwError(() => err);
      })
    );
  }
}
