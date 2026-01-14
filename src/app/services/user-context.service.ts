import { Injectable, inject } from '@angular/core';
import { of, switchMap, map, shareReplay } from 'rxjs';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';
import { UserStatusService } from './user-status.service';
import { UserProfile } from '../models/user-profile.models';
import { UserStatus } from '../models/user-status.models';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private auth = inject(AuthService);
  private profileService = inject(ProfileService);
  private statusService = inject(UserStatusService);

  /** Shortcut to the Firebase user$ from AuthService */
  readonly user$ = this.auth.user$;

  /** Profile for the logged in user (or null when logged out / not created). */
  readonly profile$ = this.user$.pipe(
    switchMap((user) => {
      if (!user) return of<UserProfile | null>(null);
      return this.profileService.getUserProfile(user.uid,user);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly status$ = this.user$.pipe(switchMap((user)=>{
    if (!user) return of<UserStatus| null>(null);
    return this.statusService.getUserStatus(user.uid,user);
  }),shareReplay({ bufferSize: 1, refCount: true }))

  /** True when profileCompleted === true in Firestore. */
  readonly profileCompleted$ = this.status$.pipe(
    map((status) => !!status?.profileCompleted)
  );
}