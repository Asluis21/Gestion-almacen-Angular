import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:8080/producto';

  constructor(private http:HttpClient) { }

  listarProductos()  {
    return this.http.get(`${this.apiUrl}/listar`).pipe(
      map((res:any) => {
        return res.productos;
      }),
      catchError((err) => {
        console.log("Error al listar los productos", err);
        return throwError(() => err);
      })
    );
  }
  
  listarProductosByDescripcion(descripcion : String)  {
    return this.http.get(`${this.apiUrl}/listar/${descripcion}`).pipe(
      map((res:any) => {
        return res.productos;
      }),
      catchError((err) => {
        console.log("Error al listar los productos", err);
        return throwError(() => err);
      })
    );
  }
  
  listarProductosDisponibles()  {
    return this.http.get(`${this.apiUrl}/listar/elegibles`).pipe(
      map((res:any) => {
        return res.productos;
      }),
      catchError((err) => {
        console.log("Error al listar los productos elegibles", err);
        return throwError(() => err);
      })
    );
  }
  
  crearProductos(productos:any[])  {
    return this.http.post(`${this.apiUrl}/crear`, productos).pipe(
      map((res:any) => {
        console.log(res.message);
        
        return res;
      }),
      catchError((err) => {
        console.log("Error al crear los productos", err);
        return throwError(() => err);
      })
    );
  }
  
  editarProducto(id:number,producto:any){
    console.log(id);
    console.log(producto);
    

    return this.http.put(`${this.apiUrl}/editar/${id}`, producto).pipe(
      map((res:any) => {
        console.log(res.message);
        return res;
      }),
      catchError((err) => {
        console.log("Error al editar el producto", err);
        return throwError(() => err);
      })
    );
  }
}
