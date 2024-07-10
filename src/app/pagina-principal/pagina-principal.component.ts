import { Component } from '@angular/core';
import { MenuLateralComponent } from "../menu-lateral/menu-lateral.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-pagina-principal',
    standalone: true,
    templateUrl: './pagina-principal.component.html',
    styleUrl: './pagina-principal.component.css',
    imports: [MenuLateralComponent, NavbarComponent, RouterModule]
})
export class PaginaPrincipalComponent {

}
