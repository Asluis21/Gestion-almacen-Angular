import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RolService } from './rol.service';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-roles',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './gestion-roles.component.html',
  styleUrl: './gestion-roles.component.css'
})
export class GestionRolesComponent {

  editarMode: boolean;
  rolForm: FormGroup;
  textobuttonCrearEditar = 'Crear nuevo rol';

  roles : any[] = [];
  rolesFiltered : any[] = [];
  buscador : string = "";

  ngOnInit(): void {
    this.filterList();
  }
  
  constructor(private rolService : RolService){

    this.listarRoles();


    this.editarMode = false;

    this.rolForm = new FormGroup({
      id: new FormControl(""),

      nombre: new FormControl("", 
        [Validators.required, Validators.minLength(3)]
      ),
      
      estado: new FormControl(true)
    })
  }

  listarRoles(){
    this.rolService.listarRoles().subscribe(
      response => {
        console.log(response);
        
        this.roles = response;
        if(this.buscador == ""){

          this.rolesFiltered = this.roles;
        }

        console.log("this.buscador: " + this.buscador);
        
        this.rolesFiltered = this.roles
        .filter(item => item.nombre.toLowerCase().indexOf(this.buscador.toLowerCase()) >= 0);
        this.filterList();
      }
    );
  }

  get camposRol():{[key:string]: AbstractControl}{
    return this.rolForm.controls;
  }

  enviarRol(){
    
    if(this.rolForm.valid){
      
      if(this.editarMode == false){
        // CREAR ROL
        this.rolForm.value.estado = true;
        this.rolService.crearRol(this.rolForm.value).subscribe({
          next: m => {
            Swal.fire('Rol', 'Rol creado con éxito', 'success');
            this.rolForm.reset();
            this.listarRoles();
          },error: err => {
            Swal.fire('Rol', 'No se pudo crear el rol', 'error');
          }
        });

      }else{
        // EDITAR ROL
        this.rolService.editarRol(this.rolForm.value.id, this.rolForm.value).subscribe({
          next: m => {
            this.crearMode();
            Swal.fire('Rol', 'Rol editado con éxito', 'success');
            this.rolForm.reset();
            this.listarRoles();

          },error: err => {
            Swal.fire('Rol', 'No se pudo editar el rol', 'error');
          }
        });
      }
      console.log(this.rolForm.value);

      // this.items();
    }else{
      Swal.fire('Rol', 'Rellene los datos correctamente', 'warning');
    }
  }

  activarEditar(id:any){
    this.editarMode = true;
    
    const rolEncontrado = this.roles.find(role => role.id == id);
    if(rolEncontrado){
      this.textobuttonCrearEditar = 'Editar rol ' + rolEncontrado?.nombre;
      this.rolForm.setValue({id:rolEncontrado?.id, nombre:rolEncontrado?.nombre, estado:rolEncontrado?.estado})
    }
  }

  crearMode(){
    this.textobuttonCrearEditar = 'Crear nuevo rol';
    this.editarMode = false;
    this.rolForm.reset();
  }

  // consultaBuscador = signal<string>('');

  // items(){
  //   const sq = this.consultaBuscador();
  //   return this.roles.filter(x => x.nombre.includes(sq));
  // }

  // buscardorActualizado(sq : string){
  //   this.consultaBuscador.set(sq);
  // }

  searchTerm$ = new Subject<string>();

  filterList(): void {
    this.searchTerm$.subscribe(term => {
      console.log("term: " + term);
      this.buscador = term;
      this.rolesFiltered = this.roles
        .filter(item => item.nombre.toLowerCase().indexOf(term.toLowerCase()) >= 0);
      
      console.log(this.rolesFiltered);
      
    });
  }
}
