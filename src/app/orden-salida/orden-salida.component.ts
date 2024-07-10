import { Component, computed, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../ingresar-orden/producto.service';
import { OrdenSalidaService } from './orden-salida.service';
import { response } from 'express';
import { Subject } from 'rxjs';
import { AuthService } from '../login/auth.service';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orden-salida',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './orden-salida.component.html',
  styleUrl: './orden-salida.component.css'
})
export class OrdenSalidaComponent {

  orden:FormGroup;
  productosRetiro:FormGroup;
  productosRetirar : any[] = [];

  productos : any[] = [];
  productosFiltered : any[] = [];
  buscador = "";
  // casa:any;

  get camposOrden():{[key:string]: AbstractControl}{
    return this.orden.controls;
  }

  ngOnInit(): void {
    this.filterList();

  }

  constructor(
    private formBuilder: FormBuilder,
    private productoService: ProductoService,
    private ordenSalidaService: OrdenSalidaService,
    private authService: AuthService

  ){

    this.listarProductos();

    this.productosRetiro = this.formBuilder.group({
      productos: formBuilder.array(this.productosRetirar.map(producto => this.createProductGroup(producto)))
    });
    
    this.orden = new FormGroup({
      fechaSalida: new FormControl(""),

      destino: new FormControl("", [
        Validators.required,
        Validators.minLength(5)
      ]),
      
      observacion: new FormControl(""),

      usuario: new FormControl(""),
      
      productos: new FormControl(""),
    })
  }

  listarProductos(){
    
    this.productoService.listarProductosDisponibles().subscribe(
      response => {
        
        console.log(response);
        
        this.productos = response;

        if(this.buscador == ""){

          this.productosFiltered = this.productos;

          console.log(this.productosFiltered);

        }

        console.log("this.buscador: " + this.buscador);
        
        this.productosFiltered = this.productos
        .filter(item => item.descripcion.toLowerCase().indexOf(this.buscador.toLowerCase()) >= 0);
        // this.filterList();
      }
    );
  }

  createProductGroup(producto:any): FormGroup {
    return this.formBuilder.group({
      id: [producto.id],
      serie: [producto.serie],
      categoria: [producto.categoria],
      descripcion: [producto.descripcion],
      estado: [producto.estado],
      cantidad: [producto.cantidad],
      peso: ["", [Validators.required]],
      ultimaCantidadRetirada: ['', [Validators.required, Validators.min(1), Validators.max(producto.cantidad)]],
      estadoProducto: [producto.estadoProducto],
      ubicacion: [producto.ubicacion],
      almacen: [producto.almacen]
    });
  }

  get productosFormArray(): FormArray {
    return this.productosRetiro.get('productos') as FormArray;
  }

  ingresarOrden(){
    console.log(this.productosRetiro.value.productos);

    if(this.productosRetiro.status != "INVALID"){
      if(this.productosRetirar.length > 0){

        if(this.orden.valid){

          this.orden.value.usuario = {"username" : this.decodificarToken().sub};
          this.orden.value.productos = this.productosRetiro.value.productos;

          console.log(this.orden.value);
          
          this.ordenSalidaService.crearOrdenSalida(this.orden.value).subscribe({
            next : m => {
              
              this.productosFormArray.clear();
              this.productosRetirar = []
              this.listarProductos();
              this.orden.reset();
              // this.filterList();
              
              Swal.fire('Orden de salida', 'Orden de salida creada correctamente', 'success');
              
            }
          });
          
        }else{
          Swal.fire('Orden de salida', 'Rellene los datos de la orden correctamente', 'warning');
        }
      }else{
        Swal.fire('Orden de salida', 'La orden no tiene productos', 'warning');
      }

    }else{
      Swal.fire('Productos', 'Rellene los datos de los productos correctamente', 'warning');
      
    }
  }

  listAux : any[] = this.productosFiltered;


  agregar(id:any){
    
    const index = this.productosFiltered.find(c => c.id == id);
    console.log(index);
    

    if (index) {
      this.productosRetirar.push(this.productosFiltered.find(c => c.id == index.id));
      this.listAux = this.productosFiltered;

      this.productosFiltered.splice(this.productosFiltered.indexOf(index, 0), 1);
    }
    
    this.productosRetiro = this.formBuilder.group({
      productos: this.formBuilder.array(this.productosRetirar.map(producto => this.createProductGroup(producto)))
    });

    
  }

  quitar(id:any){
    
    console.log(id);
    const index = this.productosRetirar.find(c => c.id == id);
    this.listAux = this.productosFiltered;

    console.log(index);
    
    if (index) {
      this.productosFiltered.push(this.productosRetirar.find(c => c.id == index.id));
      this.productosRetirar.splice(this.productosRetirar.indexOf(index, 0), 1);
    }

    this.productosRetiro = this.formBuilder.group({
      productos: this.formBuilder.array(this.productosRetirar.map(producto => this.createProductGroup(producto)))
    });

  
  }

  searchTerm$ = new Subject<string>();

  
  filterList(): void {


    this.searchTerm$.subscribe(term => {
      console.log("term: " + term);
      this.buscador = term;


      if(this.productosRetirar.length > 0){

        this.productosFiltered = this.listAux
        .filter(item => item.descripcion.toLowerCase().indexOf(term.toLowerCase()) >= 0);
      }else{
        this.productosFiltered = this.productos
          .filter(item => item.descripcion.toLowerCase().indexOf(term.toLowerCase()) >= 0);
      }
      
      console.log(this.productosFiltered);
      
    });
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
