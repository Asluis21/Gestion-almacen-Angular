import { Component } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
// import jwtDecode from 'jwt-decode';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  mostrarRol:string;

  constructor(
    private router: Router,
    private authService: AuthService
  ){

    console.log(this.decodificarToken());
    this.mostrarRol = this.decodificarToken().rol;
    this.mostrarRol = "Rol: " + this.mostrarRol.substring(5, this.mostrarRol.length).toLocaleLowerCase();
   }


  cerrarSesion(){
    this.authService.logout();
    this.router.navigate(['/login'])
  }

  decodificarToken():any{
    const jwt = this.authService.getToken();

    if(jwt){
      try{
          return jwtDecode(jwt);
      }catch(Error){
         console.log("Error al codificar");   
         return null;
      }
    }
  }
}
