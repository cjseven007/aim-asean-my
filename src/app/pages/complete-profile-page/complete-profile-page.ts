import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom, take, of, switchMap } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { UserStatusService } from '../../services/user-status.service';

import { UserProfile } from '../../models/user-profile.models';
import { UserStatus } from '../../models/user-status.models';
import { ProfileForm } from '../../components/profile-form/profile-form';

@Component({
  standalone: true,
  selector: 'app-complete-profile-page',
  imports: [CommonModule, ProfileForm],
  templateUrl: './complete-profile-page.html',
  styleUrl: './complete-profile-page.css',
})
export class CompleteProfilePage implements OnInit {
  loading = signal(true);
  savingProfile = signal(false);
  savingSurvey = signal(false);
  error = signal<string | null>(null);

  step = signal<1 | 2>(1);

  initialProfile = signal<Partial<UserProfile> | null>(null);
  status = signal<UserStatus | null>(null);

  // // File feature removed for
  // preSurveyFile = signal<File | null>(null); 
  // step 2 fields
  preSurveyFormUrl = signal<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

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

          // prefill
          this.initialProfile.set({
            uid: user.uid,
            fullName: user.displayName ?? '',
            email: user.email ?? '',
          });

          // load existing profile
          return of(user);
        })
      )
      .subscribe({
       next: async (user) => {
          if (!user) return;

          try {
            const [profile, status] = await Promise.all([
              firstValueFrom(this.profileService.getUserProfile(user.uid, user).pipe(take(1))),
              firstValueFrom(this.statusService.getUserStatus(user.uid, user).pipe(take(1))),
            ]);

            if (profile) this.initialProfile.set(profile);
            this.status.set(status);

            // Auto-jump logic
            const profileDone = !!status?.profileCompleted;
            const preDone = !!status?.preSurveyFormCompleted;

            if (profileDone && preDone) {
              this.router.navigate(['/courses']);
              return;
            }

            if (profileDone && !preDone) {
              this.step.set(2);
            } else {
              this.step.set(1);
            }
          } catch (e) {
            console.error(e);
            this.error.set('Failed to load.');
          } finally {
            this.loading.set(false);
          }
        },
        error: () => {
          this.error.set('Failed to load.');
          this.loading.set(false);
        },
      });
  }

  async onProfileSubmit(profile: UserProfile) {
    const user = await firstValueFrom(this.auth.user$.pipe(take(1)));
    if (!user) return;

    this.savingProfile.set(true);
    this.error.set(null);

    try {
      // 1) save profile
      await this.profileService.saveProfile({ ...profile, uid: user.uid, status: 'COMPLETE' });

      // 2) ensure status exists + profileCompleted true
      const existingStatus = await firstValueFrom(
        this.statusService.getUserStatus(user.uid, user).pipe(take(1))
      );

      const statusToSave: UserStatus = existingStatus
        ? { ...existingStatus, profileCompleted: true }
        : this.statusService.initStatusWithProfile(user, true);

      await this.statusService.saveStatus(statusToSave);

      // go to step 2
      this.step.set(2);
    } catch (e) {
      this.error.set('Failed to save profile.');
    } finally {
      this.savingProfile.set(false);
    }
  }

  openPreSurvey() {
    window.open(this.preSurveyFormUrl(), '_blank', 'noopener,noreferrer');
  }

  async proceedAfterPreSurvey() {
    const user = await firstValueFrom(this.auth.user$.pipe(take(1)));
    if (!user) return;

    this.savingSurvey.set(true);
    this.error.set(null);

    try {
      const existingStatus = await firstValueFrom(
        this.statusService.getUserStatus(user.uid, user).pipe(take(1))
      );

      const base: UserStatus = existingStatus ?? this.statusService.initStatusWithProfile(user, false);

      const updated: UserStatus = {
        ...base,
        profileCompleted: true, // keep true once they're here
        preSurveyFormCompleted: true,
        preSurveyFormLink: this.preSurveyFormUrl(), // optional but useful
      };

      await this.statusService.saveStatus(updated);
      this.status.set(updated);

      // ✅ go to courses
      this.router.navigate(['/courses']);
    } catch (e) {
      console.error(e);
      this.error.set('Failed to proceed.');
    } finally {
      this.savingSurvey.set(false);
    }
  }



//   // File Feature Removed
//   onFilePicked(ev: Event) {
//   const input = ev.target as HTMLInputElement;
//   this.preSurveyFile.set(input.files?.[0] ?? null);
//   }

//   async submitPreSurvey() {
//   const user = await firstValueFrom(this.auth.user$.pipe(take(1)));
//   if (!user) return;

//   const file = this.preSurveyFile();
//   if (!file) {
//     this.error.set('Please upload a screenshot as proof.');
//     return;
//   }

//   this.savingSurvey.set(true);
//   this.error.set(null);

//   try {
//     const screenshotUrl = await this.statusService.uploadSurveyScreenshot(
//       user.uid,
//       'pre',
//       file
//     );

//     await this.statusService.completePreSurvey(user, screenshotUrl);

//     this.router.navigate(['/courses']);
//   } catch (e) {
//     this.error.set('Failed to submit pre-survey.');
//   } finally {
//     this.savingSurvey.set(false);
//   }
// }

}
