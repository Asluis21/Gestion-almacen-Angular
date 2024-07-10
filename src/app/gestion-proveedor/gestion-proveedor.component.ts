import { Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProveedorService } from './proveedor.service';
import { Subject, pipe } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-proveedor',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './gestion-proveedor.component.html',
  styleUrl: './gestion-proveedor.component.css'
})
export class GestionProveedorComponent implements OnInit{

  editarMode: boolean;
  proveedorForm: FormGroup;
  textobuttonCrearEditar = 'Crear proveedor';

  proveedores : any[] = [];
  proveedoresFiltered : any = [];
  buscador : string = "";
  
  ngOnInit(): void {
    this.filterList();
  }

  constructor(
    private proveedorService: ProveedorService
  ) {

    this.listarProveedores();

    this.editarMode = false;

    this.proveedorForm = new FormGroup({
      id: new FormControl(""),

      nombre: new FormControl("", 
        [Validators.required]
      ),
      
      ruc: new FormControl("", 
        [Validators.min(10000000000), Validators.max(99999999999), Validators.required]
      ),
      
      estado: new FormControl(true)
    })

    
  }

  listarProveedores(){
    this.proveedorService.listarProveedores().subscribe(
      response => {
        console.log(response);
        
        this.proveedores = response;
        if(this.buscador == ""){

          this.proveedoresFiltered = this.proveedores;
        }

        console.log("this.buscador: " + this.buscador);
        
        this.proveedoresFiltered = this.proveedores
        .filter(item => item.nombre.toLowerCase().indexOf(this.buscador.toLowerCase()) >= 0);
        // this.filterList();
      }
    );
  }

  get camposProveedor():{[key:string]: AbstractControl}{
    return this.proveedorForm.controls;
  }

  enviarProveedor(){
    
    if(this.proveedorForm.valid){
      
      if(this.editarMode == false){
        this.proveedorForm.value.estado = true;
        this.proveedorService.crearProveedor(this.proveedorForm.value).subscribe({
          next: m => {
            Swal.fire('Proveedor', 'Proveedor creado con éxito', 'success');
            this.proveedorForm.reset();
            this.listarProveedores();
          },
          error: err => {
            Swal.fire('Proveedor', 'No se pudo crear al proveedor', 'error');
          }
        });
        
      }else{
        this.proveedorService.editarProveedor(this.proveedorForm.value.id, this.proveedorForm.value).subscribe({
          next: m => {
            this.crearMode();
            Swal.fire('Proveedor', 'Proveedor editado con éxito', 'success');
            this.proveedorForm.reset();
            this.listarProveedores();
          },

          error: err => {
            Swal.fire('Proveedor', 'No se pudo editar al proveedor', 'error');

          }
        });

      }

      console.log(this.proveedorForm.value);
      
    }else{
      Swal.fire('Proveedor', 'Rellene los datos correctamente', 'warning');
    }

  }

  activarEditar(id:any){
    this.editarMode = true;
    
    const proveedorEncontrado = this.proveedores.find(prov => prov.id == id);
    if(proveedorEncontrado){
      this.textobuttonCrearEditar = 'Editar proveedor ' + proveedorEncontrado?.nombre;
      this.proveedorForm.setValue(
        { id:proveedorEncontrado?.id, 
          nombre:proveedorEncontrado?.nombre, 
          ruc:proveedorEncontrado?.ruc, 
          estado:proveedorEncontrado?.estado
        }
      )
    }
  }

  crearMode(){
    this.textobuttonCrearEditar = 'Crear proveedor';
    this.editarMode = false;
    this.proveedorForm.reset();
  }


  searchTerm$ = new Subject<string>();

  filterList(): void {
    this.searchTerm$.subscribe(term => {
      console.log("term: " + term);
      this.buscador = term;
      this.proveedoresFiltered = this.proveedores
        .filter(item => item.nombre.toLowerCase().indexOf(term.toLowerCase()) >= 0);
      
      console.log(this.proveedoresFiltered);
      
    });
  }
}
