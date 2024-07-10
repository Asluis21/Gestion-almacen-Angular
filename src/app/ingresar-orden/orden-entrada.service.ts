import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenEntradaService {

  private apiUrl = 'http://localhost:8080/orden/entrada';

  constructor(private http:HttpClient) { }

  listarOrdenEntrada()  {
    return this.http.get(`${this.apiUrl}/listar`).pipe(
      map((res:any) => {
        return res.ordenes;
      }),
      catchError((err) => {
        console.log("Error al listar las ordenes de entrada", err);
        return throwError(() => err);
      })
    );
  }
  
  crearOrdenEntrada(ordenEntrada:any)  {
    return this.http.post(`${this.apiUrl}/crear`, ordenEntrada).pipe(
      map((res:any) => {
        console.log(res.message);
        
        return res;
      }),
      catchError((err) => {
        console.log("Error al crear la orden de entrada", err);
        return throwError(() => err);
      })
    );
  }
  
  encontrarOrdenEntradaById(id:number)  {
    return this.http.get(`${this.apiUrl}/encontrar/${id}`).pipe(
      map((res:any) => {
        return res.orden;
      }),
      catchError((err) => {
        console.log("Error al encontrar la orden de entrada", err);
        return throwError(() => err);
      })
    );
  }
}
