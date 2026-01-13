import { Injectable, inject } from '@angular/core';
import { of, switchMap, map, shareReplay } from 'rxjs';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';
import { UserProfile } from '../models/user-profile.models';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private auth = inject(AuthService);
  private profileService = inject(ProfileService);

  /** Shortcut to the Firebase user$ from AuthService */
  readonly user$ = this.auth.user$;

  /** Profile for the logged in user (or null when logged out / not created). */
  readonly profile$ = this.user$.pipe(
    switchMap((user) => {
      if (!user) return of<UserProfile | null>(null);
      return this.profileService.getUserProfile(user.uid);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  /** True when profileCompleted === true in Firestore. */
  readonly profileCompleted$ = this.profile$.pipe(
    map((profile) => !!profile?.profileCompleted)
  );
}