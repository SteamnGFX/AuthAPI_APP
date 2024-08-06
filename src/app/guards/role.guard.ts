import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const roleGuard: CanActivateFn = (route, state) => {
  const roles = route.data["roles"] as string[];
  const authService = inject(AuthService);
  const matSnackBar = inject(MatSnackBar);
  const router = inject(Router);
  
  const userRoles = authService.getRoles();

  if(!authService.isLoggedIn()){
    router.navigate(["/login"]);

    matSnackBar.open("Necesitas estar logeado para ver esta página.", "ok", {
      duration:5000,
    });
    
    return false;
  }

  if(roles.some((role) => userRoles?.includes(role))) return true;
  router.navigate(["/"]);
  matSnackBar.open("No tienes permiso para ver esta página", "ok",{
    duration: 5000,
  })
  
  return false;
};
