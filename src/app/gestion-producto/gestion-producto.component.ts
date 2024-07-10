import { Component } from '@angular/core';
import { ProductoService } from '../ingresar-orden/producto.service';
import { AlmacenService } from '../gestion-almacen/almacen.service';
import { CategoriaService } from '../gestion-categoria/categoria.service';
import { AbstractControl, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-producto',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './gestion-producto.component.html',
  styleUrl: './gestion-producto.component.css'
})
export class GestionProductoComponent {

  productoFormVisible : any = false;
  categorias:any[] = []
  almacenes:any[] = [];
  productos:any[] = [];
  productosFiltrado:any[] = [];
  productosFiltradoPorAlmacen:any[] = [];
  productoForm:FormGroup;
  idAlmacenSeleccionado: any = 1;
  buscador : string = "";

  get camposArticulo():{[key:string]: AbstractControl}{
    return this.productoForm.controls;
  }

  constructor(
    private almacenService: AlmacenService,
    private productoService : ProductoService,
    private categoriaService : CategoriaService,
  ){

    this.productoForm = new FormGroup({
      id: new FormControl(""),

      descripcion: new FormControl(""),
      
      cantidad: new FormControl(""),

      categoria: new FormControl("", Validators.required),

      almacen: new FormControl(""),

      ubicacion: new FormControl("", [
        Validators.required,
        Validators.minLength(4)
      ]),
      
      peso: new FormControl("", [
        Validators.required,
        Validators.minLength(2)
      ]),
      
      serie: new FormControl(""),
      
      estadoProducto: new FormControl(false),
    })

    almacenService.listarAlmacenes().subscribe(
      res => {
        this.almacenes = res;
      }
    );


    this.categoriaService.listarCategorias().subscribe(
      res => {
        this.categorias = res;
      }
    )

    this.listarProductos();

  }

  ngOnInit(): void {
    this.filterList();
  }


  listarProductos(){

    this.productoService.listarProductos().subscribe(
      res => {
        
        this.productos = res;
        
        console.log(this.productos);
        console.log(this.idAlmacenSeleccionado);
        
        this.productosFiltradoPorAlmacen = this.productos.filter(p => {
          
          return p.almacen.id == this.idAlmacenSeleccionado;
          
        })
        
        console.log(this.productosFiltradoPorAlmacen);

        if(this.buscador == ""){
          this.productosFiltrado = this.productosFiltradoPorAlmacen;
        }else{
          this.productosFiltrado = this.productosFiltradoPorAlmacen
        .filter(item => item.descripcion.toLowerCase().indexOf(this.buscador.toLowerCase()) >= 0);
        }
      }
    )

  }

  cambiarAlmacen(id:any){
    this.idAlmacenSeleccionado = id.target.value;
    console.log('id seleccionado:', this.idAlmacenSeleccionado);
    this.listarProductos();
  }

  editarProducto(){
    if(this.productoForm.valid){

      this.categoriaService.encontrarCategoriaById(this.productoForm.value.categoria).subscribe(
        res => {
          this.productoForm.value.categoria = res;

          this.productoService.editarProducto(this.productoForm.value.id, this.productoForm.value).subscribe({
            next: m => {
              
              Swal.fire('Producto', 'Producto editado con éxito', 'success');
              this.listarProductos();
              this.productoForm.reset();
              this.productoFormVisible = false;
            },error: err => {
              Swal.fire('Producto', 'No se puedo editar el producto', 'error');
            }
          });

        }
      )

      console.log(this.productoForm.value);


    }else{
      Swal.fire('Producto', 'Rellene los datos correctamente', 'warning');
    }
  }

  rellenarForm(id:any){
    this.productoFormVisible = true;

    const productoEncontrado = this.productosFiltrado.find(p => p.id == id);

    // console.log(productoEncontrado);
    
    this.productoForm.setValue(
      {
        id:productoEncontrado.id,
        descripcion:productoEncontrado.descripcion,
        cantidad:productoEncontrado.cantidad,
        almacen:productoEncontrado.almacen,
        peso:productoEncontrado.peso,
        estadoProducto:(!productoEncontrado.estadoProducto),
        categoria:productoEncontrado.categoria.id,
        ubicacion:productoEncontrado.ubicacion,
        serie:productoEncontrado.serie,
      }
    )
  }


  searchTerm$ = new Subject<string>();


  filterList(): void {
    this.searchTerm$.subscribe(term => {
      console.log("term: " + term);
      this.buscador = term;


      this.productosFiltrado = this.productosFiltradoPorAlmacen
        .filter(item => item.descripcion.toLowerCase().indexOf(term.toLowerCase()) >= 0);
      
      console.log(this.productosFiltrado);
      
    });
  }
}
