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
import { BehaviorSubject, from, map, of, switchMap } from 'rxjs';

const provider = new GoogleAuthProvider();

type UserProfile = {
  age: number;
  gender: 'male' | 'female';
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

    this.user$
      .pipe(
        switchMap((authUser) => {
          if (!authUser) return of(null);
          return from(getDoc(doc(db, 'users', authUser.uid))).pipe(
            map((docSnap) =>
              docSnap.exists() ? (docSnap.data() as UserProfile) : null
            )
          );
        })
      )
      .subscribe((user) => {
        if (user && user?.age && user?.gender) {
          this.profile.set({ age: user.age, gender: user.gender });
        } else {
          this.profile.set(null);
        }
      });
  }

  initAuth(): Promise<void> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        this.currentUser.next(user);
        this.authUser.set(user);
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
