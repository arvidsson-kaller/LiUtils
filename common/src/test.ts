import common from "./index";
// import { strict as assert } from "assert";
import * as fs from "fs";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
// console.log("Common includes:\n", common);

const fetchHtml = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((htmlData) => {
        resolve(htmlData);
      });
  });
};

// (async () => {
//   const TE = common.timeedit;

//   const courseLink = TE.searchLink(TE.TYPE.COURSES, {
//     max: 1,
//     search_text: "tddd27",
//   });
//   assert(
//     courseLink ===
//       "https://cloud.timeedit.net/liu/web/schema/objects.html?partajax=t&sid=3&objects=&types=219&fe=132.0&max=1&search_text=tddd27",
//   );
//   console.log("Please verify the following link works: ", courseLink);
//   const html = await fetchHtml(courseLink);
//   const objectId = Object.values(TE.parseSearch(html))[0];
//   assert(objectId === "786189.219");
//   const keyValues: string[] = [
//     "h=t",
//     "sid=3",
//     "p=20240101.x,20240701.x",
//     "objects=" + objectId,
//   ];
//   const url = TE.scrambleUrl(keyValues);
//   console.log("Please verify the following link works: ", url);
//   assert(
//     url ===
//       "https://cloud.timeedit.net/liu/web/schema/ri107826X55Z04Q6Z56g3Y80y0046Y53201gQY6Q55.html",
//   );

//   const link1 = TE.searchLink(TE.TYPE.ROOMS, {});
//   console.log("Please verify the following link works: ", link1);
//   await fetchHtml(link1);

//   const link2 = TE.searchLink(TE.TYPE.COURSES, {
//     institutions: [TE.INSTITUTIONS.IDA, TE.INSTITUTIONS.ISY],
//     campus: [TE.CAMPUS.VALLA],
//   });
//   console.log("Please verify the following link works: ", link2);
//   await fetchHtml(link2);
// })();

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

(async () => {
  const res: MasterPrograms = { programs: [] };
  const baseURL = "https://studieinfo.liu.se";
  const allProgramsHTML = await fetchHtml(
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
    if (!program.name.includes("Computer")) continue; // To just test one for now
    console.log(`Fetching ${program.name}...`);
    const programRes: Program = { name: program.name, startYears: [] };
    const programHTML = await fetchHtml(`${baseURL}/${program.url}`);
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
      const coursesHTML = await fetchHtml(`${baseURL}/${startYear.url}`);
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
  fs.writeFile("output.json", JSON.stringify(res), console.log);
})();
