import { Course } from "@/common/dist/studieinfo";

export const deepURIDecode = (URI: string) => {
  let URICopy: string = URI;
  while (decodeURIComponent(URICopy) !== URICopy) {
    URICopy = decodeURIComponent(URICopy);
  }
  return URICopy;
};

export const getNumericCourseCredit = (course: Course): number => {
  return Number(course.credits.replaceAll(/[^0-9]/g, ""));
};
