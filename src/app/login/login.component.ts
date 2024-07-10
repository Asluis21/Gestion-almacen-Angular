import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm:FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService
  ){ 

    this.loginForm = new FormGroup({
      usuario: new FormControl("", [Validators.required]),

      password: new FormControl("", [Validators.required]),
    })
  }

  login(){

    if(this.loginForm.valid){
      console.log("username: " + this.loginForm.value.usuario);
      console.log("password: " + this.loginForm.value.password);
      
      this.authService.login({
        username: this.loginForm.value.usuario,
        password: this.loginForm.value.password
      }).subscribe(
        response => {
          console.log("response: " + response);
          console.log("Sesión iniciada con éxito");
          this.router.navigate(['/dashboard/inicio'])
        });

    }else{
      alert("Mal registro");
    }
  }
}
