import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../login/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const authAdminGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);

  return authService.jefeAutorizado().pipe(
    map((res) => {
      return true;
    }),

    catchError((err) => {
      return of(false);
    })
  );
};
