import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  DestroyRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserProfile } from '../../models/user-profile.models';

@Component({
  standalone: true,
  selector: 'app-profile-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css',
})
export class ProfileForm implements OnInit{
  private destroyRef = inject(DestroyRef);

  @Input() initialProfile: Partial<UserProfile> | null = null;
  @Input() saving = false;
  @Input() emailReadonly = true; // useful for both pages

  @Output() formReady = new EventEmitter<FormGroup>();
  @Output() submitted = new EventEmitter<UserProfile>(); // parent handles saving

  form!: FormGroup;

  // options
  readonly malaysianStates = [
    'JOHOR','KEDAH','KELANTAN','MELAKA','NEGERI SEMBILAN','PAHANG','PERAK','PERLIS',
    'PULAU PINANG','SABAH','SARAWAK','SELANGOR','TERENGGANU',
    'WILAYAH PERSEKUTUAN KUALA LUMPUR','WILAYAH PERSEKUTUAN LABUAN','WILAYAH PERSEKUTUAN PUTRAJAYA',
  ];

  readonly sectors = [
    'MANUFACTURING','SERVICES','CONSTRUCTION', 'AGRICULTURE','OTHER',
  ];

  readonly sizesOfOperation = ['MICRO','SMALL','MEDIUM'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      uid: [''], // parent can patch
      // Personal
      fullName: ['', Validators.required],
      email: [{ value: '', disabled: this.emailReadonly }, [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      jobTitle: ['', Validators.required],
      // Company
      eligible: [null, Validators.required],
      companyName: ['', Validators.required],
      state: ['', Validators.required],
      branch: ['', Validators.required],
      sector: ['', Validators.required],
      womanOperated: [null, Validators.required],
      sizeOfOperation: ['', Validators.required],
      // Status
      status: ['INCOMPLETE', Validators.required],
    });

    // ALL CAPS for text typing fields (stored uppercase)
    this.enableUppercase(['fullName', 'companyName', 'branch', 'jobTitle']);

    if (this.initialProfile) {
      this.patchFromProfile(this.initialProfile);
    }

    this.formReady.emit(this.form);
  }

  patchFromProfile(p: Partial<UserProfile>) {
    this.form.patchValue(
      {
        uid: p.uid ?? '',
        fullName: (p.fullName ?? '').toUpperCase(),
        email: p.email ?? '',
        phoneNumber: p.phoneNumber ?? '',
        jobTitle: (p.jobTitle ?? '').toUpperCase(),

        eligible: p.eligible ?? null,
        companyName: (p.companyName ?? '').toUpperCase(),
        state: (p.state ?? '').toUpperCase(),
        branch: (p.branch ?? '').toUpperCase(),
        sector: (p.sector ?? '').toUpperCase(),
        womanOperated: p.womanOperated ?? null,
        sizeOfOperation: (p.sizeOfOperation ?? '').toUpperCase(),

        status: (p.status ?? 'INCOMPLETE').toUpperCase(),
      },
      { emitEvent: false }
    );
  }

  private enableUppercase(names: string[]) {
    for (const name of names) {
      const ctrl = this.form.get(name);
      if (!ctrl) continue;

      ctrl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((val) => {
          if (typeof val !== 'string') return;
          const upper = val.toUpperCase();
          if (val !== upper) ctrl.patchValue(upper, { emitEvent: false });
        });
    }
  }

  submit() {
    if (this.saving) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue(); // includes disabled email if any
    const payload: UserProfile = {
      uid: v.uid,
      eligible: v.eligible,
      companyName: v.companyName,
      state: v.state,
      branch: v.branch,
      sector: v.sector,
      womanOperated: v.womanOperated,
      sizeOfOperation: v.sizeOfOperation,
      fullName: v.fullName,
      email: v.email,
      phoneNumber: v.phoneNumber,
      jobTitle: v.jobTitle,
      status: v.status,
    };

    this.submitted.emit(payload);
  }
}
