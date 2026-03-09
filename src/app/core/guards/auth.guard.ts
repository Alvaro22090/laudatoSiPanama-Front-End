import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/']);
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !requiredRoles.includes(currentUser.role)) {
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};
