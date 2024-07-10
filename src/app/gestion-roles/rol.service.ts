import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl = 'http://localhost:8080/rol';

  constructor(private http:HttpClient) { }

  listarRoles()  {
    return this.http.get(`${this.apiUrl}/listar`).pipe(
      map((res:any) => {
        return res.roles;
      }),
      catchError((err) => {
        console.log("Error al listar los roles", err);
        return throwError(() => err);
      })
    );
  }
  
  listarRolesDisponibles()  {
    return this.http.get(`${this.apiUrl}/listar/disponible`).pipe(
      map((res:any) => {
        return res.roles;
      }),
      catchError((err) => {
        console.log("Error al listar los roles disponibles", err);
        return throwError(() => err);
      })
    );
  }
  
  encontrarRolById(id:number)  {
    return this.http.get(`${this.apiUrl}/encontrar/${id}`).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log("Error al encontrar al rol", err);
        return throwError(() => err);
      })
    );
  }
  
  crearRol(rol:any)  {
    return this.http.post(`${this.apiUrl}/crear`, rol).pipe(
      map((res:any) => {
        console.log(res.message);
        
        return res;
      }),
      catchError((err) => {
        console.log("Error al crear al rol", err);
        return throwError(() => err);
      })
    );
  }
  
  editarRol(id:number,rol:any)  {
    return this.http.put(`${this.apiUrl}/editar/${id}`, rol).pipe(
      map((res:any) => {
        console.log(res.message);
        return res;
      }),
      catchError((err) => {
        console.log("Error al editar al rol", err);
        return throwError(() => err);
      })
    );
  }
}
