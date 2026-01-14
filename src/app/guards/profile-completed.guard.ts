import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

export const profileCompletedGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  const user = auth.currentUser;
  if (!user) return router.createUrlTree(['/login']);

  const ref = doc(firestore, 'userStatuses', user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return router.createUrlTree(['/complete-profile']);
  }

  const data = snap.data() as any;
  const ok = !!data.profileCompleted && !!data.preSurveyFormCompleted;

  return ok ? true : router.createUrlTree(['/complete-profile']);
};
