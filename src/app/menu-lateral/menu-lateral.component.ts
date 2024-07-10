import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.css'
})
export class MenuLateralComponent {

  esAdmin : boolean = false;

  constructor(private authService : AuthService){

    this.esAdmin = this.decodificarToken().ROLE_JEFE == "true";
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
