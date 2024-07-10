import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService } from './categoria.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-categoria',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './gestion-categoria.component.html',
  styleUrl: './gestion-categoria.component.css'
})
export class GestionCategoriaComponent {

  editarMode: boolean;
  categoriaForm: FormGroup;
  textobuttonCrearEditar = 'Crear categoria';

  categorias : any[] = [];
  categoriasFiltered : any = [];
  buscador : string = "";


  get camposCategoria():{[key:string]: AbstractControl}{
    return this.categoriaForm.controls;
  }

  constructor(private categoriaService : CategoriaService){

    this.listarCategorias();

    this.editarMode = false;

    this.categoriaForm = new FormGroup({
      id: new FormControl(""),

      nombre: new FormControl("", 
        [Validators.minLength(3), Validators.required]
      ),
      
      estado: new FormControl(true)
    })
  }

  ngOnInit(): void {
    this.filterList();
  }

  listarCategorias(){
    this.categoriaService.listarCategorias().subscribe(
      response => {
        console.log(response);
        
        this.categorias = response;
        if(this.buscador == ""){

          this.categoriasFiltered = this.categorias;
        }

        console.log("this.buscador: " + this.buscador);
        
        this.categoriasFiltered = this.categorias
        .filter(item => item.nombre.toLowerCase().indexOf(this.buscador.toLowerCase()) >= 0);
        // this.filterList();
      }
    );
  }

  enviarCategoria(){
    
    if(this.categoriaForm.valid){
      
      if(this.editarMode == false){
        // CREAR CATEGORIA
        this.categoriaForm.value.estado = true;
        
        this.categoriaService.crearCategoria(this.categoriaForm.value).subscribe({
          next: m => {
            Swal.fire('Categoría', 'Categoría creada con éxito', 'success');
            this.categoriaForm.reset();
            this.listarCategorias();
          },error: err => {
            Swal.fire('Categoría', 'No se pudo creada la categoría', 'error');
          }
        });

      }else{
        // EDITAR CATEGORIA
        this.categoriaService.editarCategoria(this.categoriaForm.value.id, this.categoriaForm.value).subscribe({
          next: m => {
            this.crearMode();
            Swal.fire('Categoría', 'Categoría editada con éxito', 'success');
            this.categoriaForm.reset();
            this.listarCategorias();

          },error: err => {
            Swal.fire('Categoría', 'No se pudo editar la categoría', 'error');
          }
        });

      }
      console.log(this.categoriaForm.value);
      
    }else{
      Swal.fire('Categoría', 'Rellene los datos correctamente', 'warning');
    }

  }

  activarEditar(id:any){
    this.editarMode = true;
    
    const categoriaEncontrada = this.categorias.find(cat => cat.id == id);
    if(categoriaEncontrada){
      this.textobuttonCrearEditar = 'Editar categoria ' + categoriaEncontrada?.nombre;
      this.categoriaForm.setValue(
        { id:categoriaEncontrada?.id, 
          nombre:categoriaEncontrada?.nombre,
          estado:categoriaEncontrada?.estado
        }
      )
    }
  }

  crearMode(){
    this.textobuttonCrearEditar = 'Crear categoria';
    this.editarMode = false;
    this.categoriaForm.reset();
  }

  searchTerm$ = new Subject<string>();

  filterList(): void {
    this.searchTerm$.subscribe(term => {
      console.log("term: " + term);
      this.buscador = term;
      this.categoriasFiltered = this.categorias
        .filter(item => item.nombre.toLowerCase().indexOf(term.toLowerCase()) >= 0);
      
      console.log(this.categoriasFiltered);
      
    });
  }
}

