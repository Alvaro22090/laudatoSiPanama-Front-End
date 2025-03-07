import { CanActivateFn, Router } from '@angular/router';
import { LoginServiceService } from '../services/login-service.service';
import { inject } from '@angular/core';

export const authGuardsGuard: CanActivateFn = (route, state) => {
  const authService = inject(LoginServiceService);
  const router = inject(Router);

  // Verifica si el usuario está autenticado
  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }

  // Verifica si se requieren roles específicos
  const requiredRoles = route.data?.['roles'] as string[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !requiredRoles.includes(currentUser.role)) {
      router.navigate(['/forbidden']);
      return false;
    }
  }

  return true;
};
