import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private firestore: Firestore) {}

  private profileDocRef(uid: string) {
    return doc(this.firestore, 'profiles', uid);
  }

  getUserProfile(uid: string): Observable<UserProfile | null> {
    const ref = this.profileDocRef(uid);
    return from(getDoc(ref)).pipe(
      map((snapshot) =>
        snapshot.exists() ? (snapshot.data() as UserProfile) : null
      )
    );
  }

  saveProfile(profile: UserProfile): Promise<void> {
    const ref = this.profileDocRef(profile.uid);
    return setDoc(ref, profile, { merge: true });
  }
}