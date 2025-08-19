import { Injectable, signal } from '@angular/core';
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  UserCredential,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { BehaviorSubject } from 'rxjs';

const provider = new GoogleAuthProvider();

export type UserProfile = {
  age: number;
  gender: 'male' | 'female';
  testTakenAt?: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authUser = signal<User | null | undefined>(undefined);
  public currentUser = new BehaviorSubject<User | null | undefined>(undefined);

  public profile = signal<UserProfile | null>(null);

  constructor() {
    auth.useDeviceLanguage();
  }

  initAuth(): Promise<void> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        this.currentUser.next(user);
        this.authUser.set(user);

        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const snapshot = await getDoc(userRef);

          if (snapshot.exists()) {
            const profile = snapshot.data() as UserProfile;
            this.profile.set({
              age: profile.age,
              gender: profile.gender,
              testTakenAt: profile?.testTakenAt,
            });
          } else {
            this.profile.set(null);
          }
        }

        resolve();
      });
    });
  }

  get user$() {
    return this.currentUser.asObservable();
  }

  get user() {
    return this.currentUser.value;
  }

  public signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  public signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  public resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  public googleSignIn(): Promise<UserCredential> {
    return signInWithPopup(auth, provider);
  }

  public signOut(): Promise<void> {
    return signOut(auth);
  }
}
