import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private apiUrl = 'http://localhost:8080/proveedor';

  private httpHeader = new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http:HttpClient) { }

  listarProveedores()  {
    return this.http.get(`${this.apiUrl}/listar`).pipe(
      map((res:any) => {
        return res.proveedor;
      }),
      catchError((err) => {
        console.log("Error al listar proveedores", err);
        return throwError(() => err);
      })
    );
  }
  
  listarProveedoresDisponibles()  {
    return this.http.get(`${this.apiUrl}/listar/disponible`).pipe(
      map((res:any) => {
        return res.proveedor;
      }),
      catchError((err) => {
        console.log("Error al listar proveedores disponibles", err);
        return throwError(() => err);
      })
    );
  }
  
  encontrarProveedorById(id:number)  {
    return this.http.get(`${this.apiUrl}/encontrar/${id}`).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log("Error al encontrar al proveedor", err);
        return throwError(() => err);
      })
    );
  }
  
  crearProveedor(proveedor:any)  {
    return this.http.post(`${this.apiUrl}/crear`, proveedor).pipe(
      map((res:any) => {
        console.log(res.message);
        
        return res;
      }),
      catchError((err) => {
        console.log("Error al crear proveedor", err);
        return throwError(() => err);
      })
    );
  }
  
  editarProveedor(id:number,proveedor:any)  {
    return this.http.put(`${this.apiUrl}/editar/${id}`, proveedor).pipe(
      map((res:any) => {
        console.log(res.message);
        return res;
      }),
      catchError((err) => {
        console.log("Error al editar proveedor", err);
        return throwError(() => err);
      })
    );
  }
  
  eliminarProveedor(id:number)  {
    return this.http.put(`${this.apiUrl}/eliminar/logico/${id}`,"").pipe(
      map((res:any) => {
        console.log(res.message);
        return res;
      }),
      catchError((err) => {
        console.log("Error al elimnar proveedor", err);
        return throwError(() => err);
      })
    );
  }


}
