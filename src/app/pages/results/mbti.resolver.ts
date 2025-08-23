import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { filter, first, switchMap } from 'rxjs';
import { User } from 'firebase/auth';
import { collection } from 'firebase/firestore';
import { db } from '../../firebase.config';

export const mbtiResolver: ResolveFn<any> = () => {
  const firebaseService = inject(FirebaseService);
  const authService = inject(AuthService);

  return authService.user$.pipe(
    filter((user): user is User => !!user),
    first(),
    switchMap((user) => {
      const resultsRef = collection(db, `users/${user.uid}/mbtiResults`);
      return firebaseService.getLast(resultsRef, 'createdAt');
    })
  );
};
