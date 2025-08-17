import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs';
import { User } from 'firebase/auth';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    filter((user): user is User | null => user !== undefined),
    take(1),
    map((user) => {
      if (!user) return true;
      return router.createUrlTree(['/']);
    })
  );
};
