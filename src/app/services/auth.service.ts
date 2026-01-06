import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // declare first
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    // now it's safe to use this.auth
    this.user$ = authState(this.auth);
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider).then(() => {});
  }

  signOut(): Promise<void> {
    return fbSignOut(this.auth);
  }
}
