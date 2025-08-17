import { ResolveFn } from '@angular/router';
import { ref } from 'firebase/storage';
import { storage } from '../../firebase.config';
import { inject } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

export const imageResolver: ResolveFn<any> = async (route) => {
  const firebaseService = inject(FirebaseService);
  const id = route.paramMap.get('id');

  if (!id) return null;

  try {
    const imageRef = ref(storage, `og-images/${id}.png`);
    return await firebaseService.getStorageURL(imageRef);
  } catch (error) {
    console.warn('Image not found:', error);
    return 'https://sisiquiz/assets/images/sisiquiz.jpg';
  }
};
