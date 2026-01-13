import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { UserStatus } from '../models/user-status.models';
import {User} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UserStatusService {
  constructor(private firestore: Firestore) {}

  private userStatusMap(data:any|undefined, user:User){
    const status:UserStatus={
        uid: data.uid ?? user.uid,
        profileCompleted: data.profileCompleted ?? false,
        preSurveyFormCompleted: data.preSurveyFormCompleted??false,
        preSurveyFormLink:data.preSurveyFormLink??null,
        postSurveyFormCompleted:data.postSurveyFormCompleted??false,
        postSurveyFormLink:data.postSurveyFormLink??null
    }

    return status;
  }

  private statusDocRef(uid: string) {
    return doc(this.firestore, 'userStatuses', uid);
  }

  getUserStatus(uid: string, user:User): Observable<UserStatus | null> {
    const ref = this.statusDocRef(uid);
    return from(getDoc(ref)).pipe(
      map((snapshot) =>
        snapshot.exists() ? (this.userStatusMap(snapshot.data(), user)) : null
      )
    );
  }

  initStatusWithProfile(user:User,profileCompleted:boolean):UserStatus{
    return {
      uid: user.uid,
      profileCompleted: profileCompleted,
      preSurveyFormCompleted: false,
      preSurveyFormLink:'',
      postSurveyFormCompleted:false,
      postSurveyFormLink:''
    }
  }

  saveStatus(status: UserStatus): Promise<void> {
    const ref = this.statusDocRef(status.uid);
    return setDoc(ref, status, { merge: true });
  }
}