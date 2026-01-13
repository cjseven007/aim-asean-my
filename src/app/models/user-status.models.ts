export interface UserStatus{
    uid:string;
    profileCompleted:boolean;
    // pre-survey form
    preSurveyFormCompleted:boolean;
    preSurveyFormLink:string;
    // post-survey form
    postSurveyFormCompleted:boolean;
    postSurveyFormLink:string;
}