import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  private apiUrl = 'http://localhost:8080/almacen';

  constructor(private http:HttpClient) { }

  listarAlmacenes()  {
    return this.http.get(`${this.apiUrl}/listar`).pipe(
      map((res:any) => {
        return res.almacen;
      }),
      catchError((err) => {
        console.log("Error al listar los almacenes", err);
        return throwError(() => err);
      })
    );
  }
  
  listarAlmacenesDisponibles()  {
    return this.http.get(`${this.apiUrl}/listar/disponible`).pipe(
      map((res:any) => {
        return res.almacen;
      }),
      catchError((err) => {
        console.log("Error al listar los almacenes disponibles", err);
        return throwError(() => err);
      })
    );
  }
  
  encontrarAlmacenById(id:number)  {
    return this.http.get(`${this.apiUrl}/encontrar/${id}`).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log("Error al encontrar el almacén", err);
        return throwError(() => err);
      })
    );
  }
  
  crearAlmacen(almacen:any)  {
    return this.http.post(`${this.apiUrl}/crear`, almacen).pipe(
      map((res:any) => {
        console.log(res.message);
        
        return res;
      }),
      catchError((err) => {
        console.log("Error al crear el almacén", err);
        return throwError(() => err);
      })
    );
  }
  
  editarAlmacen(id:number,almacen:any)  {
    return this.http.put(`${this.apiUrl}/editar/${id}`, almacen).pipe(
      map((res:any) => {
        console.log(res.message);
        return res;
      }),
      catchError((err) => {
        console.log("Error al editar el almacén", err);
        return throwError(() => err);
      })
    );
  }
}
