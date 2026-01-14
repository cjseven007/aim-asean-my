import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile.models';
import {User} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private firestore: Firestore) {}

  private userProfileMap(data:any|undefined, user:User){
    const profile:UserProfile={
        uid: data.uid ?? user.uid,
        eligible:data.eligible??false,
        companyName:data.companyName??'',
        state:data.state??'',
        branch: data.branch??'',
        sector:data.sector??'',
        womanOperated: data.womanOperated??false,
        sizeOfOperation:data.sizeOfOperation??'',
        fullName: data.fullName??user.displayName,
        email:data.email??user.email??null,
        phoneNumber:data.phoneNumber??'',
        jobTitle:data.jobTitle??'',
        status:data.status??''
    }

    return profile;
  }

  private profileDocRef(uid: string) {
    return doc(this.firestore, 'profiles', uid);
  }

  getUserProfile(uid: string, user:User): Observable<UserProfile | null> {
    const ref = this.profileDocRef(uid);
    return from(getDoc(ref)).pipe(
      map((snapshot) =>
        snapshot.exists() ? (this.userProfileMap(snapshot.data(), user)) : null
      )
    );
  }

  saveProfile(profile: UserProfile): Promise<void> {
    const ref = this.profileDocRef(profile.uid);
    return setDoc(ref, profile, { merge: true });
  }
}