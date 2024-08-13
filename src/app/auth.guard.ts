import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (await authService.isAuthenticated()) {
    if (['/login', '/register'].includes(state.url)) {
      router.navigate(['']);
      return false;
    }
    return true;
  }
  if (['/login', '/register'].includes(state.url)) {
    return true;
  }
  router.navigate(['login']);
  return false;
};
