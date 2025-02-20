import { Course, Ecv, PeriodName } from "./studieinfo";

export interface MasterPlan {
  program: PlannedMasterProgram;
  startYear: PlannedStartYear;
  semesters: SemesterPlan[];
  specialization: string;
  note: string;
}

export interface PlannedMasterProgram {
  id: number;
  name: string;
}

export interface PlannedStartYear {
  id: number;
  name: string;
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
