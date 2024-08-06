import { Component, inject, Injector, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidatorsError } from '../../interfaces/validators-error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatInputModule,ReactiveFormsModule, RegisterComponent, CommonModule, RouterLink, MatSelectModule ,MatIconModule, AsyncPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  RoleService = inject(RoleService);
  AuthService = inject(AuthService);
  MatSnackbar = inject(MatSnackBar)
  roles$!:Observable<Role[]>  
  fb = inject(FormBuilder)
  registrerForm!: FormGroup;
  router = inject(Router);
  confirmpasswordHide!: boolean;
  passwordHide!: boolean;
  errors!:ValidatorsError[];

  register(){
    this.AuthService.register(this.registrerForm.value).subscribe({
      next:(response)=>{
        this.MatSnackbar.open(response.message, 'Close',{
          duration:5000,
          horizontalPosition: 'center',
        })
        this.router.navigate(['/login']);
      },
      error:(err:HttpErrorResponse)=>{
        if(err!.status === 400){
          this.errors = err!.error;
          this.MatSnackbar.open('Error en la validaciones','Close',{
            duration: 5000,
            horizontalPosition: 'center',
          })
        }
      },
      complete:()=>console.log('Registro correcto')
    });
  }

  ngOnInit(): void {
    this.registrerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      roles: [''],
      confirmedPassword: ['', [Validators.required]],
    },
    {
      validator: this.passwordMatchValidator,
    }
  )
    
    this.roles$ = this.RoleService.getRoles();
  }
  
  private passwordMatchValidator(control:AbstractControl):{[key:string]:boolean } | null{
    const password = control.get('password')?.value;
    const confirmedPassword = control.get('confirmPassword')?.value;
    if (password !== confirmedPassword){
      return{'passwordMismatch' : true};
    }
    return null;
  }
}
