import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/user';

  constructor(private http:HttpClient) { }

  listarUsuario()  {
    return this.http.get(`${this.apiUrl}/listar`).pipe(
      map((res:any) => {
        
        return res.usuarios;
      }),
      catchError((err) => {
        console.log("Error al listar los usuarios", err);
        return throwError(() => err);
      })
    );
  }
  
  listarUsuariosDisponibles()  {
    return this.http.get(`${this.apiUrl}/listar/disponible`).pipe(
      map((res:any) => {
        return res.usuarios;
      }),
      catchError((err) => {
        console.log("Error al listar los usuarios disponibles", err);
        return throwError(() => err);
      })
    );
  }
  
  encontrarUsuarioById(id:number)  {
    return this.http.get(`${this.apiUrl}/encontrar/${id}`).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log("Error al encontrar el usuario", err);
        return throwError(() => err);
      })
    );
  }
  
  crearUsuario(usuario:any)  {
    return this.http.post(`http://localhost:8080/auth/registro`, usuario).pipe(
      map((res:any) => {
        console.log(res.message);
        
        return res;
      }),
      catchError((err) => {
        console.log("Error al crear el usuario", err);
        return throwError(() => err);
      })
    );
  }
  
  editarUsuario(id:number,usuario:any)  {
    return this.http.put(`${this.apiUrl}/editar/${id}`, usuario).pipe(
      map((res:any) => {
        console.log(res.message);
        return res;
      }),
      catchError((err) => {
        console.log("Error al editar el usuario", err);
        return throwError(() => err);
      })
    );
  }
}
