import jsdom from "jsdom";
import { rateLimitFetchHtml } from "./fetchhtml";
const { JSDOM } = jsdom;

export interface MasterPrograms {
  programs: Program[];
}

export interface Program {
  name: string;
  startYears: StartYear[];
}

export interface StartYear {
  name: string;
  semesters: Semester[];
}

export interface Semester {
  name: string;
  specializations: Specialization[];
}

export interface Specialization {
  name: string;
  periods: Period[];
}

export interface Period {
  name: Name;
  courses: Course[];
}

export interface Course {
  courseCode: string;
  courseName: string;
  credits: string;
  level: Level;
  timetableModule: string;
  ECV: Ecv;
  info: string;
}

export enum Ecv {
  C = "C",
  CE = "C/E",
  E = "E",
  V = "V",
}

export enum Level {
  A1X = "A1X",
  G1X = "G1X",
  G2X = "G2X",
}

export enum Name {
  Period0 = "Period 0",
  Period1 = "Period 1",
  Period2 = "Period 2",
}

export const getAllMasterData = async () => {
  const res: MasterPrograms = { programs: [] };
  const baseURL = "https://studieinfo.liu.se";
  const allProgramsHTML = await rateLimitFetchHtml(
    `${baseURL}/en?Term=Master&Type=programme`,
  );
  const allProgramsDOM = new JSDOM(allProgramsHTML);
  const allPrograms = [
    ...allProgramsDOM.window.document.querySelectorAll(
      "#study-guide-search-results-programme a",
    ),
  ]
    .map((a) => {
      return { name: a.textContent, url: a.href };
    })
    .filter((a) => a.url.includes("program"));
  console.log(`Fetching ${allPrograms.length} programs`);
  for (const program of allPrograms) {
    console.log(`Fetching ${program.name}...`);
    const programRes: Program = { name: program.name, startYears: [] };
    const programHTML = await rateLimitFetchHtml(`${baseURL}/${program.url}`);
    const programDOM = new JSDOM(programHTML);
    const allStartYears = [
      ...programDOM.window.document.querySelectorAll(
        "#related_entity_navigation option",
      ),
    ].map((o) => {
      return { year: o.textContent.trim(), url: o.value };
    });
    for (const startYear of allStartYears) {
      const yearRes: StartYear = { name: startYear.year, semesters: [] };
      const coursesHTML = await rateLimitFetchHtml(
        `${baseURL}/${startYear.url}`,
      );
      const coursesDOM = new JSDOM(coursesHTML);
      const allSemesterDOMs = coursesDOM.window.document.querySelectorAll(
        "section.accordion.semester",
      );
      for (const semesterDOM of allSemesterDOMs) {
        const semester = semesterDOM
          .querySelector("header h3")
          .textContent.trim();
        const semesterRes: Semester = { name: semester, specializations: [] };
        const specializationDOMs =
          semesterDOM.querySelectorAll("div.specialization");
        for (const specializationDOM of specializationDOMs) {
          const specialization =
            (
              specializationDOM
                .querySelector("caption")
                .querySelector("span") ||
              specializationDOM.querySelector("caption")
            )?.textContent?.trim() || "Courses";
          const specializationRes: Specialization = {
            name: specialization,
            periods: [],
          };
          const allPeriodsDOM =
            specializationDOM.querySelectorAll("tbody.period");
          for (const periodDOM of allPeriodsDOM) {
            const period =
              periodDOM.querySelector("th[colspan='7']")?.textContent?.trim() ||
              "Period";
            const allCourses: Course[] = [
              ...periodDOM.querySelectorAll("tr.main-row"),
            ]
              .map((tr) =>
                [
                  ...tr.querySelectorAll("td"),
                  [...tr.nextElementSibling?.classList]?.includes("details-row")
                    ? tr.nextElementSibling
                    : "",
                ].map((td) => td?.textContent?.trim() || ""),
              )
              .map((course) => {
                return {
                  courseCode: course.at(0),
                  courseName: course.at(1),
                  credits: course.at(2),
                  level: course.at(3),
                  timetableModule: course.at(4),
                  ECV: course.at(5),
                  info: course.at(6),
                };
              });
            const periodRes: Period = { name: period, courses: allCourses };
            specializationRes.periods.push(periodRes);
          }
          semesterRes.specializations.push(specializationRes);
        }
        yearRes.semesters.push(semesterRes);
      }
      programRes.startYears.push(yearRes);
    }
    console.log(`Finished fetching ${program.name}`);
    res.programs.push(programRes);
  }
  return res;
};
