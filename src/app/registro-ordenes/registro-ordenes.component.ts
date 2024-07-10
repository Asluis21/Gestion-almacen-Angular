import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenEntradaService } from '../ingresar-orden/orden-entrada.service';
import { OrdenSalidaService } from '../orden-salida/orden-salida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-ordenes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro-ordenes.component.html',
  styleUrl: './registro-ordenes.component.css'
})
export class RegistroOrdenesComponent {

  tipoOrden:String;
  fechaInicio: String = this.formatDate(new Date());
  fechaFin: String = this.formatDate(new Date());;

  ordenEntrada : any[] = []
  
  ordenSalida : any[] = []
  
  itemsEntrada : any[] = [];
  itemsSalida : any[] = [];

  constructor(
    private router: Router,
    private ordenEntradaService: OrdenEntradaService,
    private ordenSalidaService: OrdenSalidaService,
  ){
    this.tipoOrden = "entrada";
    this.listarOrdenEntrada();
  }

  listarOrdenEntrada(){
    this.ordenEntradaService.listarOrdenEntrada().subscribe(
      response => {
        console.log(response);
        this.ordenEntrada = response;
        this.itemsEntrada = this.ordenEntrada;
      }
    );
  }
  
  listarOrdenSalida(){
    this.ordenSalidaService.listarOrdenSalida().subscribe(
      response => {
        console.log(response);
        this.ordenSalida = response;
        this.itemsSalida = this.ordenSalida;

      }
    );
  }

  changeTipoOrden(event : any){

    this.tipoOrden = event.target.value;

    if(this.tipoOrden == "salida" && this.itemsSalida.length == 0){
      this.listarOrdenSalida();
    }

    console.log(this.tipoOrden);
  }

  

  verDetalle(id:any){

    let orden; 

    if(this.tipoOrden == 'entrada'){
      //REDIRECT ID DE LA ENTRADA
      orden = this.ordenEntrada.find(o => o.id == id);
      
      
    }else{
      //REDIRECT ID DE LA SALIDA
      orden = this.ordenSalida.find(o => o.id == id);
    }
    
    this.router.navigate(['/dashboard/detalle/orden'], { queryParams:{
      id:orden?.id,
      tipoOrden:this.tipoOrden,
    }})

    console.log(orden);
  }

  formatDate(date: Date): string {
    // const year = date.getFullYear();
    // const month = String(date.getMonth() + 1).padStart(2, '0');
    // const day = String(date.getDate()).padStart(2, '0');
    // return `${day}/${month}/${year}`;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  filtrarFecha(){
    console.log(this.fechaInicio);
    console.log(this.fechaFin);

    if((this.fechaInicio != this.fechaFin)  && (this.fechaInicio && this.fechaFin) && (this.fechaFin > this.fechaInicio)){

        if(this.tipoOrden == 'entrada'){
          
          this.itemsEntrada = this.ordenEntrada.filter(item => {
            
            return this.fechaInicio <= item.fecha_ingreso && item.fecha_ingreso <= this.fechaFin
          })
          
        }else{
          
          this.itemsSalida= this.ordenSalida.filter(item => {
            return this.fechaInicio <= item.fecha_salida && item.fecha_salida <= this.fechaFin
          })
          
        }
    }else{
      Swal.fire('Fecha', 'Ingresa las fechas válidas', 'warning');      
    } 
  }

  resetearFiltro(){
    this.fechaInicio = this.formatDate(new Date());
    this.fechaFin = this.formatDate(new Date());;

    if(this.tipoOrden == 'entrada'){
      //REDIRECT ID DE LA ENTRADA
      this.itemsEntrada = this.ordenEntrada
      
      
    }else{
      //REDIRECT ID DE LA SALIDA
      this.itemsSalida = this.ordenSalida;
    }
  }
}
