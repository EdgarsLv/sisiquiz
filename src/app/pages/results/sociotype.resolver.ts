import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { filter, first, switchMap } from 'rxjs';
import { User } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { db } from '../../firebase.config';

export const sociotypeResolver: ResolveFn<any> = () => {
  const firebaseService = inject(FirebaseService);
  const authService = inject(AuthService);

  return authService.user$.pipe(
    filter((user): user is User => !!user),
    first(),
    switchMap((user) => {
      const userRef = doc(db, `users/${user!.uid}`);
      return firebaseService.get(userRef);
    })
  );
};
