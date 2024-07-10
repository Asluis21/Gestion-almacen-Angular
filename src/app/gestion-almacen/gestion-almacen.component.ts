import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlmacenService } from './almacen.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-almacen',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './gestion-almacen.component.html',
  styleUrl: './gestion-almacen.component.css'
})
export class GestionAlmacenComponent {
  editarMode: boolean;
  almacenForm: FormGroup;
  textobuttonCrearEditar = 'Crear almacén';

  almacenes : any[] = [];
  almacenesFiltered : any = [];
  buscador : string = "";

  get camposAlmacen():{[key:string]: AbstractControl}{
    return this.almacenForm.controls;
  }

  constructor(private almacenService : AlmacenService){

    this.listarAlmacenes();

    this.editarMode = false;

    this.almacenForm = new FormGroup({
      id: new FormControl(""),

      nombre: new FormControl("", 
        [Validators.minLength(3), Validators.required]
      ),
      
      ubicacion: new FormControl("", 
        [Validators.minLength(3), Validators.required]
      ),
      
      estado: new FormControl(true)
    })
  }

  ngOnInit(): void {
    this.filterList();
  }

  listarAlmacenes(){
    this.almacenService.listarAlmacenes().subscribe(
      response => {
        console.log(response);
        
        this.almacenes = response;
        if(this.buscador == ""){

          this.almacenesFiltered = this.almacenes;
        }

        console.log("this.buscador: " + this.buscador);
        
        this.almacenesFiltered = this.almacenes
        .filter(item => item.nombre.toLowerCase().indexOf(this.buscador.toLowerCase()) >= 0);
        // this.filterList();
      }
    );
  }

  enviarAlmacen(){
    
    if(this.almacenForm.valid){
      
      if(this.editarMode == false){
        // CREAR ALAMCEN
        this.almacenForm.value.estado = true;

        this.almacenService.crearAlmacen(this.almacenForm.value).subscribe({
          next: m => {
            Swal.fire('Almacén', 'Almacén creado con éxito', 'success');
            this.almacenForm.reset();
            this.listarAlmacenes();
          },error: err => {
            Swal.fire('Almacén', 'No se pudo crear el almacén', 'error');
          }
        });
      }else{
        // EDITAR ALAMCEN
        this.almacenService.editarAlmacen(this.almacenForm.value.id, this.almacenForm.value).subscribe({
          next: m => {
            this.crearMode();
            Swal.fire('Almacén', 'Almacén editado con éxito', 'success');
            this.almacenForm.reset();
            this.listarAlmacenes();
          },error: err => {
            Swal.fire('Almacén', 'No se pudo editar el almacén', 'error');

          }
        });
      }
      console.log(this.almacenForm.value);

    }else{
      Swal.fire('Almacén', 'Rellene los datos correctamente', 'warning');
    }
  }

  activarEditar(id:any){
    this.editarMode = true;
    
    const almacenEncontrada = this.almacenes.find(alm => alm.id == id);
    if(almacenEncontrada){
      this.textobuttonCrearEditar = 'Editar almacén ' + almacenEncontrada?.nombre;
      this.almacenForm.setValue(
        { id:almacenEncontrada?.id, 
          nombre:almacenEncontrada?.nombre,
          ubicacion:almacenEncontrada?.ubicacion,
          estado:almacenEncontrada?.estado
        }
      )
    }
  }

  crearMode(){
    this.textobuttonCrearEditar = 'Crear Almacén';
    this.editarMode = false;
    this.almacenForm.reset();
  }

  searchTerm$ = new Subject<string>();

  filterList(): void {
    this.searchTerm$.subscribe(term => {
      console.log("term: " + term);
      this.buscador = term;
      this.almacenesFiltered = this.almacenes
        .filter(item => item.nombre.toLowerCase().indexOf(term.toLowerCase()) >= 0);
      
      console.log(this.almacenesFiltered);
      
    });
  }
}

