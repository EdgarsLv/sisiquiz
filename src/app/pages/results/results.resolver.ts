import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { filter, first, from, map, switchMap } from 'rxjs';
import { collection } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { User } from 'firebase/auth';

export const resultsResolver: ResolveFn<any> = () => {
  const firebaseService = inject(FirebaseService);
  const authService = inject(AuthService);

  return authService.user$.pipe(
    filter((user): user is User => !!user),
    first(),
    switchMap((user) => {
      const testResultsRef = collection(db, `users/${user!.uid}/testResults`);
      return firebaseService.getCollection(testResultsRef, 'date');
    })
  );
};
