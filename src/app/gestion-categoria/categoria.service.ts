import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = 'http://localhost:8080/categoria';

  constructor(private http:HttpClient) { }

  listarCategorias()  {
    return this.http.get(`${this.apiUrl}/listar`).pipe(
      map((res:any) => {
        return res.categorias;
      }),
      catchError((err) => {
        console.log("Error al listar las categorias", err);
        return throwError(() => err);
      })
    );
  }
  
  listarCategoriasDisponibles()  {
    return this.http.get(`${this.apiUrl}/listar/disponible`).pipe(
      map((res:any) => {
        return res.categorias;
      }),
      catchError((err) => {
        console.log("Error al listar las categorias disponibles", err);
        return throwError(() => err);
      })
    );
  }
  
  encontrarCategoriaById(id:number)  {
    return this.http.get(`${this.apiUrl}/encontrar/${id}`).pipe(
      map((res:any) => {
        return res.categoría;
      }),
      catchError((err) => {
        console.log("Error al encontrar la categoría", err);
        return throwError(() => err);
      })
    );
  }
  
  crearCategoria(rol:any)  {
    return this.http.post(`${this.apiUrl}/crear`, rol).pipe(
      map((res:any) => {
        console.log(res.message);
        
        return res;
      }),
      catchError((err) => {
        console.log("Error al crear la categoría", err);
        return throwError(() => err);
      })
    );
  }
  
  editarCategoria(id:number,categoria:any)  {
    return this.http.put(`${this.apiUrl}/editar/${id}`, categoria).pipe(
      map((res:any) => {
        console.log(res.message);
        return res;
      }),
      catchError((err) => {
        console.log("Error al editar la categoría", err);
        return throwError(() => err);
      })
    );
  }
}
