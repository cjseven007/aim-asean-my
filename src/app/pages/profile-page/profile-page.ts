import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

import { firstValueFrom, of, switchMap, take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-profile-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-page.html',
})
export class ProfilePage implements OnInit {
  form!: FormGroup;

  // 🔥 make these signals so zoneless CD can react to them
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      companyName: ['', Validators.required],
      state: ['', Validators.required],
    });

    this.auth.user$
      .pipe(
        take(1),
        switchMap((user) => {
          if (!user) {
            this.router.navigate(['/login-required']);
            this.loading.set(false);
            return of(null);
          }
          return this.profileService.getUserProfile(user.uid).pipe(take(1));
        })
      )
      .subscribe({
        next: (profile) => {
          if (profile) {
            this.form.patchValue({
              fullName: profile.fullName,
              companyName: profile.companyName,
              state: profile.state,
            });
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          this.error.set('Failed to load profile. Please try again.');
          this.loading.set(false);
        },
      });
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = await firstValueFrom(this.auth.user$.pipe(take(1)));
    if (!user) {
      this.router.navigate(['/login-required']);
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const { fullName, companyName, state } = this.form.value;

    try {
      await this.profileService.saveProfile({
        uid: user.uid,
        fullName,
        companyName,
        state,
        profileCompleted: true,
      });

      this.router.navigate(['/courses']);
    } catch (err) {
      console.error('Error saving profile:', err);
      this.error.set('Failed to save profile. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }
}
