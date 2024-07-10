import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { log } from 'console';
import { ProductoService } from './producto.service';
import { OrdenEntradaService } from './orden-entrada.service';
import { CategoriaService } from '../gestion-categoria/categoria.service';
import { AlmacenService } from '../gestion-almacen/almacen.service';
import { response } from 'express';
import { ProveedorService } from '../gestion-proveedor/proveedor.service';
import { AuthService } from '../login/auth.service';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingresar-orden',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './ingresar-orden.component.html',
  styleUrl: './ingresar-orden.component.css'
})
export class IngresarOrdenComponent {

  producto:FormGroup;
  orden:FormGroup;
  descripcionBuscar:String = "";

  productos:any[] = [];
  categorias:any[] = [];
  almacenes:any[] = [];
  proveedores:any[] = [];
  productosAlmacen:any[] = [];

  get camposArticulo():{[key:string]: AbstractControl}{
    return this.producto.controls;
  }
  
  get camposOrden():{[key:string]: AbstractControl}{
    return this.orden.controls;
  }

  constructor(
    private productoService : ProductoService,
    private ordenEntradaService: OrdenEntradaService,
    private categoriaService: CategoriaService,
    private almacenService: AlmacenService,
    private proveedorService: ProveedorService,
    private authService: AuthService
  ){
    console.log(this.decodificarToken().sub);
    
    this.categoriaService.listarCategoriasDisponibles().subscribe(response => this.categorias = response);
    this.almacenService.listarAlmacenesDisponibles().subscribe(response => this.almacenes = response);
    this.proveedorService.listarProveedoresDisponibles().subscribe(response => this.proveedores = response);

    this.producto = new FormGroup({
      id: new FormControl(""),

      descripcion: new FormControl("", 
        [Validators.required, Validators.minLength(3)

      ]),
      
      cantidad: new FormControl("", 
        [Validators.required,
         Validators.min(1)
      ]),

      categoria: new FormControl("", Validators.required),

      almacen: new FormControl("", [
        Validators.required
      ]),

      ubicacion: new FormControl("", [
        Validators.required,
        Validators.minLength(4)
      ]),
      
      peso: new FormControl("", [
        Validators.required,
        Validators.minLength(2)
      ]),
      
      serie: new FormControl("", []),
      
      estadoProducto: new FormControl(false),
    })

    this.orden = new FormGroup({
      fechaIngreso: new FormControl(Date.now()),

      usuario: new FormControl(""),

      proveedor: new FormControl("", [
        Validators.required
      ]),

      puntoLlegada: new FormControl("", [
        Validators.required,
        Validators.minLength(5)
      ]),

      productos: new FormControl(""),

      observacion: new FormControl("")
    })
  }

  agregarProductos(){
    
    if(this.producto.valid){

      this.producto.value.id = this.productos.length == 0 ? 1 : this.productos[this.productos.length -1].id + 1;

      console.log(this.producto.value.estadoProducto);
      
      if(this.producto.value.estadoProducto == null || this.producto.value.estadoProducto == false){
        this.producto.value.estadoProducto = true;
      }else{
        this.producto.value.estadoProducto = false;
      }
      
      this.producto.value.categoria = this.categorias.filter(c => c.id == this.producto.value.categoria)[0];
      this.producto.value.almacen = this.almacenes.filter(a => a.id == this.producto.value.almacen)[0];
      this.productos.push(this.producto.value);
      console.log(this.producto.value);

      this.producto.reset();
    }else{

      Swal.fire('Orden de Entrada', 'Mal registro del producto', 'error');
    }

    console.log(this.productos);
  }

  eliminarProducto(id:any){

    const index = this.productos.find(c => c.id == id);
    console.log(index);
    
    if (index) {
      this.productos.splice(this.productos.indexOf(index, 0), 1);
    }
    
    console.log(this.productos);
  }

  buscarDescripcionProducto(){

    if(this.descripcionBuscar != ""){
      this.productoService.listarProductosByDescripcion(this.descripcionBuscar).subscribe(
        response => {
          this.productosAlmacen = response;
        }
      )

    }else{
      Swal.fire('Orden de Entrada', 'Introduce un valor en el buscador', 'info');
    }

  }

  escogerProducto(id:any){
    const productoEncontrado = this.productosAlmacen.find(p => p.id == id);

    this.producto.setValue(
      {
        id:productoEncontrado.id,
        descripcion:productoEncontrado.descripcion,
        cantidad:"",
        almacen:productoEncontrado.almacen.id,
        peso:"",
        estadoProducto:(!productoEncontrado.estadoProducto),
        categoria:productoEncontrado.categoria.id,
        ubicacion:productoEncontrado.ubicacion,
        serie:productoEncontrado.serie,
      }
    )
  }

  guardarOrder(){
    
    if(this.orden.valid){
      if(this.productos.length > 0){
      
        
        this.productoService.crearProductos(this.productos).subscribe({
          next : m => {

            this.orden.value.proveedor = this.proveedores.filter(p => p.id == this.orden.value.proveedor)[0];

            this.orden.value.usuario = {"username" : this.decodificarToken().sub};
            this.orden.value.productos = m.productos;
            console.log(this.orden.value);
            

            this.ordenEntradaService.crearOrdenEntrada(this.orden.value).subscribe({
              next: m => {

                Swal.fire('Orden de Entrada', 'Orden de entrada realizada con éxito', 'success');
                
                this.productosAlmacen = [];
                this.productos = [];
                this.orden.reset();
              }
            });
          }
        })

  
      }else{
        Swal.fire('Orden de Entrada', 'La orden no tiene productos', 'warning');
      }

    }else{
      Swal.fire('Orden de Entrada', 'Registre la orden mal registrada', 'warning');
    }
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
