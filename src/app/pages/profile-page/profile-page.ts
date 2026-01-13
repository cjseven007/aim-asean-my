import { Component, OnInit, signal, DestroyRef, inject } from '@angular/core';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserProfile } from '../../models/user-profile.models';
import { UserStatusService } from '../../services/user-status.service';
import { UserStatus } from '../../models/user-status.models';

@Component({
  standalone: true,
  selector: 'app-profile-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-page.html',
})
export class ProfilePage implements OnInit {
  private destroyRef = inject(DestroyRef);

  form!: FormGroup;

  // zoneless-friendly signals
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  // keep loaded profile so submit can merge
  existingProfile = signal<UserProfile | null>(null);

  // dropdown options
  readonly malaysianStates = [
    'JOHOR',
    'KEDAH',
    'KELANTAN',
    'MELAKA',
    'NEGERI SEMBILAN',
    'PAHANG',
    'PERAK',
    'PERLIS',
    'PULAU PINANG',
    'SABAH',
    'SARAWAK',
    'SELANGOR',
    'TERENGGANU',
    'WILAYAH PERSEKUTUAN KUALA LUMPUR',
    'WILAYAH PERSEKUTUAN LABUAN',
    'WILAYAH PERSEKUTUAN PUTRAJAYA',
  ];

  readonly sectors = [
    'AGRICULTURE',
    'CONSTRUCTION',
    'EDUCATION',
    'ENERGY',
    'FINANCE',
    'HEALTHCARE',
    'ICT',
    'LOGISTICS',
    'MANUFACTURING',
    'RETAIL/WHOLESALE',
    'SERVICES',
    'TOURISM',
    'OTHER',
  ];

  readonly sizesOfOperation = [
    'MICRO (1-9)',
    'SMALL (10-49)',
    'MEDIUM (50-199)',
    'LARGE (200+)',
  ];

  readonly statuses = ['INCOMPLETE', 'COMPLETE'];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private profileService: ProfileService,
    private statusService: UserStatusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      // Personal Details
      fullName: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      jobTitle: ['', Validators.required],

      // Company Details
      eligible: [null, Validators.required], // boolean radio
      companyName: ['', Validators.required],
      state: ['', Validators.required],
      branch: ['', Validators.required],
      sector: ['', Validators.required], // dropdown
      womanOperated: [null, Validators.required], // boolean radio
      sizeOfOperation: ['', Validators.required], // dropdown

      // Completion Status
      status: ['INCOMPLETE', Validators.required],
    });

    // convert typed text fields to ALL CAPS (stored as uppercase)
    this.enableUppercaseForControls([
      'fullName',
      'companyName',
      'branch',
      'jobTitle',
    ]);

    this.auth.user$
      .pipe(
        take(1),
        switchMap((user) => {
          if (!user) {
            this.router.navigate(['/login-required']);
            this.loading.set(false);
            return of(null);
          }

          // Prefill from auth (email/displayName) while loading profile
          this.form.patchValue(
            {
              fullName: (user.displayName ?? '').toUpperCase(),
              email: user.email ?? '',
            },
            { emitEvent: false }
          );

          return this.profileService.getUserProfile(user.uid, user).pipe(take(1));
        })
      )
      .subscribe({
        next: (profile) => {
          if (profile) {
            this.existingProfile.set(profile);

            this.form.patchValue(
              {
                fullName: (profile.fullName ?? '').toUpperCase(),
                email: profile.email ?? this.form.get('email')?.value ?? '',
                phoneNumber: profile.phoneNumber ?? '',
                jobTitle: (profile.jobTitle ?? '').toUpperCase(),

                eligible: profile.eligible ?? null,
                companyName: (profile.companyName ?? '').toUpperCase(),
                state: (profile.state ?? '').toUpperCase(),
                branch: (profile.branch ?? '').toUpperCase(),
                sector: (profile.sector ?? '').toUpperCase(),
                womanOperated: profile.womanOperated ?? null,
                sizeOfOperation: (profile.sizeOfOperation ?? '').toUpperCase(),

                status: (profile.status ?? 'INCOMPLETE').toUpperCase(),
              },
              { emitEvent: false }
            );
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

  private enableUppercaseForControls(controlNames: string[]) {
    for (const name of controlNames) {
      const ctrl = this.form.get(name);
      if (!ctrl) continue;

      ctrl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((val) => {
          if (typeof val !== 'string') return;
          const upper = val.toUpperCase();
          if (val !== upper) {
            ctrl.patchValue(upper, { emitEvent: false });
          }
        });
    }
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

    try {
      const existing = this.existingProfile();

      // getRawValue includes disabled controls (email)
      const v = this.form.getRawValue();

      const payload: UserProfile = {
        uid: user.uid,

        // Company Details
        eligible: v.eligible,
        companyName: v.companyName,
        state: v.state,
        branch: v.branch,
        sector: v.sector,
        womanOperated: v.womanOperated,
        sizeOfOperation: v.sizeOfOperation,

        // Personal Details
        fullName: v.fullName,
        email: v.email, // from getRawValue (disabled control)
        phoneNumber: v.phoneNumber,
        jobTitle: v.jobTitle,

        // Completion Status
        status: 'COMPLETE',

        // Merge safety (if you ever add new fields later)
        ...(existing ? { ...existing } : {}),
      };

      await this.profileService.saveProfile(payload);

      const existingStatus = await firstValueFrom(
        this.statusService.getUserStatus(user.uid, user).pipe(take(1))
      );

      const statusToSave: UserStatus = existingStatus
        ? { ...existingStatus, profileCompleted: true }
        : this.statusService.initStatusWithProfile(user, true);

      await this.statusService.saveStatus(statusToSave);

      this.router.navigate(['/courses']);
    } catch (err) {
      console.error('Error saving profile:', err);
      this.error.set('Failed to save profile. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }
}
