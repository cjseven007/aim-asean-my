import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { take, switchMap, of, firstValueFrom } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { UserStatusService } from '../../services/user-status.service';
import { UserProfile } from '../../models/user-profile.models';
import { UserStatus } from '../../models/user-status.models';

import { ProfileForm} from '../../components/profile-form/profile-form';

@Component({
  standalone: true,
  selector: 'app-profile-page',
  imports: [CommonModule, ProfileForm],
  templateUrl: './profile-page.html',
})
export class ProfilePage implements OnInit {
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  initialProfile = signal<Partial<UserProfile> | null>(null);

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private statusService: UserStatusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.user$
      .pipe(
        take(1),
        switchMap((user) => {
          if (!user) {
            this.router.navigate(['/login']);
            return of(null);
          }
          // prefill from auth
          this.initialProfile.set({
            uid: user.uid,
            fullName: user.displayName ?? '',
            email: user.email ?? '',
          });
          return this.profileService.getUserProfile(user.uid, user).pipe(take(1));
        })
      )
      .subscribe({
        next: (profile) => {
          if (profile) this.initialProfile.set(profile);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load profile.');
          this.loading.set(false);
        },
      });
  }

  async onSubmit(profile: UserProfile) {
    const user = await firstValueFrom(this.auth.user$.pipe(take(1)));
    if (!user) return;

    this.saving.set(true);
    this.error.set(null);

    try {
      await this.profileService.saveProfile({ ...profile, uid: user.uid, status: 'COMPLETE' });

      // keep status profileCompleted true (but DO NOT force preSurvey completed)
      const existingStatus = await firstValueFrom(
        this.statusService.getUserStatus(user.uid, user).pipe(take(1))
      );

      const statusToSave: UserStatus = existingStatus
        ? { ...existingStatus, profileCompleted: true }
        : this.statusService.initStatusWithProfile(user, true);

      await this.statusService.saveStatus(statusToSave);
    } catch (e) {
      this.error.set('Failed to save.');
    } finally {
      this.saving.set(false);
    }
  }
}
