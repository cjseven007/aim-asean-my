import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { UserStatus } from '../models/user-status.models';
import {User} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UserStatusService {
  private storage = inject(Storage);
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

  // -- Upload files feature removed for the time being -- //
   // Upload screenshot and return download URL
  async uploadSurveyScreenshot(
    uid: string,
    type: 'pre' | 'post',
    file: File
  ): Promise<string> {
    const path = `userStatuses/${uid}/${type}-survey/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  // Save pre-survey completion using preSurveyFormLink as screenshot URL
  async completePreSurvey(user: User, screenshotUrl: string): Promise<void> {
    const refDoc = this.statusDocRef(user.uid);
    await setDoc(
      refDoc,
      {
        uid: user.uid,
        preSurveyFormCompleted: true,
        preSurveyFormLink: screenshotUrl, // screenshot URL stored here
      } satisfies Partial<UserStatus>,
      { merge: true }
    );
  }

  // Save post-survey completion using postSurveyFormLink as screenshot URL
  async completePostSurvey(user: User, screenshotUrl: string): Promise<void> {
    const refDoc = this.statusDocRef(user.uid);
    await setDoc(
      refDoc,
      {
        uid: user.uid,
        postSurveyFormCompleted: true,
        postSurveyFormLink: screenshotUrl, // screenshot URL stored here
      } satisfies Partial<UserStatus>,
      { merge: true }
    );
  }
}