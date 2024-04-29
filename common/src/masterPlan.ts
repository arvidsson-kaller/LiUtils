import { Course, Ecv, PeriodName } from "./studieinfo";

export interface MasterPlan {
  programName: string;
  startYear: string;
  semesters: SemesterPlan[];
  specialization: string;
  note: string;
}

export interface SemesterPlan {
  name: string;
  periods: PeriodPlan[];
}

export interface PeriodPlan {
  name: PeriodName;
  courses: PlannedCourse[];
}

export interface PlannedCourse extends Course {
  semester: null | string;
  specializations: PlannedCourseSpecialization[];
  note: string;
}

export interface PlannedCourseSpecialization {
  name: string;
  ECV: Ecv;
}
