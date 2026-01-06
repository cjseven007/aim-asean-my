import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, of, switchMap, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

@Injectable({ providedIn: 'root' })
export class ProfileCompletedGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.user$.pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          // Not logged in → handled by AuthGuard normally, but just in case:
          return of(this.router.createUrlTree(['/login-required']));
        }

        return this.profileService.getUserProfile(user.uid).pipe(
          take(1),
          map((profile) => {
            if (profile?.profileCompleted) {
              return true;
            }
            // Logged in but profile not completed → go to profile page
            return this.router.createUrlTree(['/profile']);
          })
        );
      })
    );
  }
}
