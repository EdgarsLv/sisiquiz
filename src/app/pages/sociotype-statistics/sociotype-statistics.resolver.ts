import { ResolveFn } from '@angular/router';
import { collection } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { inject } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

export const sociotypeStatisticsResolver: ResolveFn<any> = () => {
  const firebaseService = inject(FirebaseService);
  const statsRef = collection(db, 'mbtiStatistics');

  return firebaseService.getCollection(statsRef);
};
