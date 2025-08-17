import { Injectable, inject } from '@angular/core';
import { LoaderService } from './loader.service';
import {
  addDoc,
  CollectionReference,
  DocumentReference,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, StorageReference } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private loader = inject(LoaderService);

  async get<T>(ref: DocumentReference<T>): Promise<T | undefined> {
    this.loader.show();
    try {
      const snapshot = await getDoc(ref);
      return snapshot.exists() ? (snapshot.data() as T) : undefined;
    } finally {
      this.loader.hide();
    }
  }

  async set<T>(ref: DocumentReference<T>, data: T): Promise<void> {
    this.loader.show();
    try {
      await setDoc(ref, data);
    } finally {
      this.loader.hide();
    }
  }

  async add<T>(ref: CollectionReference<T>, data: T): Promise<string> {
    this.loader.show();
    try {
      const docRef = await addDoc(ref, data);
      return docRef.id;
    } finally {
      this.loader.hide();
    }
  }

  async getCollection<T>(
    ref: CollectionReference<T>,
    orderField?: string,
    direction: 'asc' | 'desc' = 'asc'
  ): Promise<T[]> {
    this.loader.show();
    try {
      const q = orderField ? query(ref, orderBy(orderField, direction)) : ref;
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => doc.data());
    } finally {
      this.loader.hide();
    }
  }

  async getStorageURL(ref: StorageReference): Promise<string> {
    this.loader.show();
    try {
      return getDownloadURL(ref);
    } finally {
      this.loader.hide();
    }
  }

  async update<T>(ref: DocumentReference<T>, data: Partial<T>): Promise<void> {
    this.loader.show();
    try {
      await updateDoc(ref, data);
    } finally {
      this.loader.hide();
    }
  }
}
