import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.userAutorizado().pipe(
    map((res) => {
      return true;
    }),

    catchError((err) => {

      console.log('Error:', err);
      authService.logout();
      router.navigate(['/login']);
      return of(false);
      
      // return of(false);
    })
  );
  
};
