import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  private httpHeader = new HttpHeaders(
    {'Content-Type':'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    }
  );

  constructor(private http:HttpClient) { }

  login(loginRequest:any){
    return this.http.post(`${this.apiUrl}/login`,loginRequest, {headers:this.httpHeader}).pipe(
      
      map((res:any) => {
        this.setToken(res.token);
        console.log("Token del login => " + res.token);
        
        return res.token;
      }),
      catchError((err) => {
        console.log("Datos incorrectos", err);
        return throwError(() => err);
      })
    );
  }

  jefeAutorizado(){
    return this.http.get(`${this.apiUrl}/verificar/jefe`, {headers:this.httpHeader}).pipe(
      map((res:any) => {
        return true;
      }),
      catchError((err) => {
        console.log("No autorizado", err);
        return throwError(() => err);
      })
    );
  }

  operarioAutorizado(){
    // const header = new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken());
    // const headers = { headers: header };

    return this.http.get(`${this.apiUrl}/verificar/operario`).pipe(
      map((res:any) => {
        return true;
      }),
      
      catchError((err) => {
        console.log("No autorizado", err);
        return throwError(() => new Error(err));
      })
    );
  }
  
  userAutorizado(){
  
    return this.http.get(`${this.apiUrl}/verificar/usuario`).pipe(
      map((res:any) => {
        return true;
      }),
      
      catchError((err) => {
        console.log("No autorizado", err);
        return throwError(() => new Error(err));
      })
    );
  }

  isAuthenticated(): boolean{
    return this.getToken() !== null;
  }


  setToken(token:string):void{
    
    localStorage.setItem('token', token);
    
  }

  getToken() {
    
    return localStorage.getItem('token');
  }

  logout():void {
    localStorage.removeItem('token');
  }

  isTokenValid(): Observable<boolean> {
    return this.userAutorizado().pipe(
      map((res: any) => {
        console.log("Respuesta isTokenValid" + res);
        return true;
      }),
      catchError((err) => {
        console.log('No autorizado', err);
        return of(false);
      })
    );
  }

  
}
