import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { UserContextService } from '../services/user-context.service';

export const profileCompletedGuard: CanActivateFn = () => {
  const userContext = inject(UserContextService);
  const router = inject(Router);

  return userContext.profileCompleted$.pipe(
    take(1),
    map((completed) => {
      if (completed) {
        return true;
      }
      // Logged in but profile incomplete → go to profile page
      return router.createUrlTree(['/profile']);
    })
  );
};