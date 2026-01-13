import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  browserLocalPersistence,
  setPersistence,
  authState,
  User,
} from '@angular/fire/auth';
import { user as authUser$ } from '@angular/fire/auth';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  /** Firebase auth user observable */
  user$ = authUser$(this.auth); // Observable<User | null>

  /** Convenience boolean */
  readonly isAuthenticated$ = this.user$.pipe(map((user) => !!user));

  async signInWithGoogle(): Promise<void> {
    // Ensure persistence across reloads
    // await setPersistence(this.auth, browserLocalPersistence);

    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }
}