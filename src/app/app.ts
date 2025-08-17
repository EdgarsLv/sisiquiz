import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  UserCredential,
} from 'firebase/auth';
import './firebase.config';
import { auth } from './firebase.config';

const provider = new GoogleAuthProvider();

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('sisiquiz');

  public googleSignIn(): Promise<UserCredential> {
    return signInWithPopup(auth, provider);
  }
}
