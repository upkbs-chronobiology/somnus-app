import { User } from './user';

export class StudyAccess {
    constructor(
        public readonly userId: number,
        public readonly studyId: number,
        public readonly level: AccessLevel,
    ) { }
}

export class RichStudyAccess extends StudyAccess {
    constructor(studyAccess: StudyAccess, public readonly user: User) {
        super(studyAccess.userId, studyAccess.studyId, studyAccess.level);
        if (user.id !== studyAccess.userId) throw 'User does not match id of StudyAccess';
    }
}

export enum AccessLevel {
    Own = 'own',
    Write = 'write',
    Read = 'read',
}
