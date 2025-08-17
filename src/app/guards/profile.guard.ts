import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { debounceTime, filter, map, take } from 'rxjs';
import { User } from 'firebase/auth';

export const profileGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    filter((user): user is User | null => user !== undefined),
    debounceTime(500),
    take(1),
    map(() => {
      const profile = authService.profile();

      if (profile) return true;
      return router.createUrlTree(['profile']);
    })
  );
};
