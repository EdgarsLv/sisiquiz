import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const iqTestGuard: CanActivateFn = () => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  const countdown = storageService.getCountdown('iq');

  if (countdown) {
    return router.createUrlTree(['test-list']);
  }

  return true;
};
