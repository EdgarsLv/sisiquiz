import { ResolveFn } from '@angular/router';
import { doc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { inject } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

export const resultResolver: ResolveFn<any> = async (route) => {
  const firebaseService = inject(FirebaseService);
  const id = route.paramMap.get('id');

  if (!id) return null;

  const docRef = doc(db, `statistics/${id}`);

  return await firebaseService.get(docRef);
};
