import {
  Course,
  Period,
  PlannedCourse,
  PlannedCourseSpecialization,
  Semester,
  SemesterPlan,
} from "./backend-client";

export const deepURIDecode = (URI: string) => {
  let URICopy: string = URI;
  while (decodeURIComponent(URICopy) !== URICopy) {
    URICopy = decodeURIComponent(URICopy);
  }
  return URICopy;
};

export const getNumericCourseCredit = (
  course: Course | PlannedCourse,
): number => {
  return Number(course.credits.replaceAll(/[^0-9]/g, ""));
};

export const addCourseToSemesterPlan = (
  course: Course,
  semesterPlan: SemesterPlan,
  semester: Semester,
  allSemesters: Semester[],
  currentSemester: Semester,
) => {
  if (!semesterPlan) {
    return;
  }
  const plannedSpecializations: PlannedCourseSpecialization[] = [];
  const coursePeriods: Period[] = [];
  // Create list of all specializations, and a list of all periods that have the course
  for (const sem of allSemesters) {
    for (const spec of sem.specializations) {
      for (const per of spec.periods) {
        for (const cor of per.courses) {
          if (cor.courseCode === course.courseCode) {
            if (!plannedSpecializations.find((s) => s.name === spec.name)) {
              plannedSpecializations.push({
                name: spec.name,
                ECV: cor.ECV,
              });
            }
            if (!coursePeriods.find((p) => p.name === per.name)) {
              coursePeriods.push(per);
            }
          }
        }
      }
    }
  }
  for (const coursePeriod of coursePeriods) {
    const existingPeriodPlan = semesterPlan.periods.find(
      (p) => p.name === coursePeriod.name,
    );
    const courseInPeriod = coursePeriod.courses.find(
      (c) => c.courseCode === course.courseCode,
    );
    if (!courseInPeriod) {
      continue;
    }
    // Only add the course if it is not already added
    if (
      !existingPeriodPlan?.courses.find(
        (c) => c.courseName === course.courseName,
      )
    ) {
      existingPeriodPlan?.courses.push({
        ...courseInPeriod,
        semester: currentSemester.name === semester.name ? null : semester.name,
        note: "",
        specializations: plannedSpecializations,
      });
    }
  }
};

export const removeCourseFromSemesterPlan = (
  course: Course | PlannedCourse,
  semesterPlan: SemesterPlan,
) => {
  if (!semesterPlan) {
    return;
  }
  for (const periodPlan of semesterPlan.periods) {
    periodPlan.courses = periodPlan.courses.filter(
      (plannedCourse) => plannedCourse.courseCode !== course.courseCode,
    );
  }
};
