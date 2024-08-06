import { Component, inject } from '@angular/core';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { RoleService } from '../../services/role.service';
import { RoleCreateRequest } from '../../interceptor/role-create-request';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [RoleFormComponent,RoleListComponent, AsyncPipe, MatSnackBarModule, MatIconModule, MatSelectModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  roleService = inject(RoleService);
  AuthService = inject(AuthService);
  errorMessage = '';
  role:RoleCreateRequest = {} as RoleCreateRequest;
  roles$ = this.roleService.getRoles();
  snackBar = inject(MatSnackBar);
  users$ = this.AuthService.getAll();
  selectedUser: string = '';
  selectedRole: string = '';


  createRole(role: RoleCreateRequest) {
    this.roles$ = this.roleService.getRoles();
    this.roleService.createRole(role).subscribe({
      next: (response: { message: string }) => {
        this.snackBar.open("El rol se ha creado correctamente", "ok", {
          duration: 5000,
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.errorMessage = error.error;
        } 
      }
    });
  }
  
  deleteRole(id:string){
    this.roleService.delete(id).subscribe({
      next:(response)=>{
        this.roles$ = this.roleService.getRoles();
        this.snackBar.open("El rol eliminado correctamente","Close",{
          duration:3000,
        })
      },
      error:(error:HttpErrorResponse) =>{
        this.snackBar.open(error.message,"Close",{
          duration:3000,
        })
      }
    })
  }

  assignRole(){
    this.roleService.assignRole(this.selectedUser,this.selectedRole).subscribe({
      next:(response)=>{
        this.roles$ = this.roleService.getRoles();
        this.snackBar.open("El rol se ha asignado correctamente","Close",{
          duration:3000,
        })
      },
      error:(error:HttpErrorResponse) =>{
        this.snackBar.open(error.message,"Close",{
          duration:3000,
        })
      }
    })
  }

}
