import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from './usuario.service';
import { Subject } from 'rxjs';
import { RolService } from '../gestion-roles/rol.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css'
})
export class CrearUsuarioComponent {

  usuario: FormGroup;
  textbotonCrearEditar : string = "Crear Usuario";
  editarMode: boolean;

  usuarios : any[] = [];
  usuariosFiltered : any = [];
  buscador : string = "";

  roles : any[] = [];
 
  get camposUsuario():{[key:string]: AbstractControl}{
    return this.usuario.controls;
  }

  constructor(private usuarioService : UsuarioService, private rolService : RolService){

    this.listarUsuarios();

    this.editarMode = false;

    this.usuario = new FormGroup({
      id: new FormControl(""),

      nombre: new FormControl("", 
        [ Validators.required, Validators.minLength(2)]
      ),

      apellidoPaterno: new FormControl("", 
        [ Validators.required, Validators.minLength(2)]
      ),

      apellidoMaterno: new FormControl("", 
        [ Validators.required, Validators.minLength(2)]
      ),
      
      dni: new FormControl("", 
        [ Validators.required, Validators.min(10000000), Validators.max(99999999)]
      ),
      
      rol: new FormControl("", 
        [ Validators.required]
      ),

      username: new FormControl("", 
        [ Validators.required, Validators.minLength(3)]
      ),

      password: new FormControl("", 
        [ Validators.required, Validators.minLength(3)]
      ),
      
      estado: new FormControl(true),
    })

  }

  ngOnInit(): void {
    this.filterList();

    this.rolService.listarRolesDisponibles().subscribe(
      response => {
        console.log(response);
        this.roles = response;
      }
    )
  }

  listarUsuarios(){
    this.usuarioService.listarUsuario().subscribe(
      response => {
        console.log(response);
        
        this.usuarios = response;
        if(this.buscador == ""){

          this.usuariosFiltered = this.usuarios;
        }

        console.log("this.buscador: " + this.buscador);
        
        this.usuariosFiltered = this.usuarios
        .filter(item => item.dni.toLowerCase().indexOf(this.buscador.toLowerCase()) >= 0);
        // this.filterList();
      }
    );
  }

  activarEditar(id:any){
    this.editarMode = true;
    
    const usuarioEncontrado = this.usuarios.find(user => user.id == id);
    
    console.log(usuarioEncontrado);
    
    if(usuarioEncontrado){
      
      this.textbotonCrearEditar = 'Editar usuario ' + usuarioEncontrado?.username;
      
      this.usuario.setValue(
        {
          id:usuarioEncontrado?.id, 
          nombre:usuarioEncontrado?.nombre,
          username:usuarioEncontrado?.username,
          apellidoPaterno:usuarioEncontrado?.apellidoPaterno,
          apellidoMaterno:usuarioEncontrado?.apellidoMaterno,
          dni:usuarioEncontrado?.dni,
          rol:usuarioEncontrado?.rol.id,
          estado:usuarioEncontrado?.estado,
          password:'...'
        }
      )
    }
  }

  crearMode(){
    this.textbotonCrearEditar = 'Crear Usuario';
    this.editarMode = false;
    this.usuario.reset(); // FORMULARIO
  }

  enviarUsuario(){
    
    if(this.usuario.valid){
      
      if(this.editarMode == false){
        // CREAR ROL
        this.usuario.value.estado = true;
        
        
        this.usuario.value.rol = this.roles.filter(r => r.id == this.usuario.value.rol)[0];
        console.log(this.usuario.value);
        
        this.usuarioService.crearUsuario(this.usuario.value).subscribe({
          next: m => {
            Swal.fire('Usuario', 'Usuario creado con éxito', 'success');
            this.usuario.reset();
            this.listarUsuarios();
          },
          error: err => {
            Swal.fire('Usuario', 'No se pudo crear el usuario', 'error');
          }
        });

      }else{
        // EDITAR ROL

        this.usuario.value.rol = this.roles.filter(r => r.id == this.usuario.value.rol)[0];

        console.log(this.usuario.value);
        
        this.usuarioService.editarUsuario(this.usuario.value.id, this.usuario.value).subscribe({
          next: m => {
            this.crearMode();
            Swal.fire('Usuario', 'Usuario editado con éxito', 'success');
            this.usuario.reset();
            this.listarUsuarios();

          },error: err => {
            Swal.fire('Usuario', 'No se pudo editar el usuario', 'error');
          }
        });
      }
      console.log(this.usuario.value);

    }else{
      Swal.fire('Usuario', 'Rellene los datos correctamente', 'warning');
    }

  }

  searchTerm$ = new Subject<string>();

  filterList(): void {
    this.searchTerm$.subscribe(term => {
      console.log("term: " + term);
      this.buscador = term;
      this.usuariosFiltered = this.usuarios
        .filter(item => item.dni.toLowerCase().indexOf(term.toLowerCase()) >= 0);
      
      console.log(this.usuariosFiltered);
      
    });
  }
}
