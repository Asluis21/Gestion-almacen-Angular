import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdenEntradaService } from '../ingresar-orden/orden-entrada.service';
import { OrdenSalidaService } from '../orden-salida/orden-salida.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { response } from 'express';
import { Orden } from './orden';

@Component({
  selector: 'app-detalle-orden',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './detalle-orden.component.html',
  styleUrl: './detalle-orden.component.css'
})
export class DetalleOrdenComponent {

  tipoOrden:String = ''; 
  id:number = 0; 
  ordenEntrada: any;
  ordenSalida: any;
  orden : Orden = new Orden();  
  

  constructor(
    private route: ActivatedRoute,
    private ordenEntradaService: OrdenEntradaService,
    private ordenSalidaService: OrdenSalidaService,
  ){

    route.queryParams.subscribe(params => {
      this.tipoOrden = params['tipoOrden'],

      console.log(this.tipoOrden);
      
      this.id = +params['id']
    })

    if(this.tipoOrden == "entrada"){
      ordenEntradaService.encontrarOrdenEntradaById(this.id).subscribe(
        response => {
          this.orden = response;
        }
      )
    }else{
      ordenSalidaService.encontrarOrdenSalidaById(this.id).subscribe(
        response => {
          this.orden = response;
        }
      )
    }

    console.log(this.orden);
    
  }


}
