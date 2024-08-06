import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const matSnackbar = inject(MatSnackBar);

  if(inject(AuthService).isLoggedIn()){
    return true;
  }

  matSnackbar.open('Necesitas estar logueado para ver esta pagina', 'Ok',{
    duration: 3000,
  });
  inject(Router).navigate(['/'])
  return false;
};
