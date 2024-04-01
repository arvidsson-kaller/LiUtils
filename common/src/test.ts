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

(async () => {
  const res = {};
  const baseURL = "https://studieinfo.liu.se";
  const allProgramsHTML = await fetchHtml(
    `${baseURL}/en?Term=Master&Type=programme`
  );
  const allProgramsDOM = new JSDOM(allProgramsHTML);
  const allPrograms = [
    ...allProgramsDOM.window.document.querySelectorAll(
      "#study-guide-search-results-programme a"
    ),
  ]
    .map((a) => {
      return { name: a.textContent, url: a.href };
    })
    .filter((a) => a.url.includes("program"));
  for (const program of allPrograms) {
    if (!program.name.includes("Software")) continue; // To just test one for now
    res[program.name] = {};
    const programHTML = await fetchHtml(`${baseURL}/${program.url}`);
    const programDOM = new JSDOM(programHTML);
    const allStartYears = [
      ...programDOM.window.document.querySelectorAll(
        "#related_entity_navigation option"
      ),
    ].map((o) => {
      return { year: o.textContent.trim(), url: o.value };
    });
    for (const startYear of allStartYears) {
      res[program.name][startYear.year] = {};
      const coursesHTML = await fetchHtml(`${baseURL}/${startYear.url}`);
      const coursesDOM = new JSDOM(coursesHTML);
      const allSemesterDOMs = coursesDOM.window.document.querySelectorAll(
        "section.accordion.semester"
      );
      for (const semesterDOM of allSemesterDOMs) {
        const semester = semesterDOM
          .querySelector("header h3")
          .textContent.trim();
        res[program.name][startYear.year][semester] = {};
        const specializationDOMs =
          semesterDOM.querySelectorAll("div.specialization");
        for (const specializationDOM of specializationDOMs) {
          const specialization =
            (
              specializationDOM
                .querySelector("caption")
                .querySelector("span") ||
              specializationDOM.querySelector("caption")
            ).textContent.trim() || "Courses";
          const allCourses = [
            ...specializationDOM.querySelectorAll("tr.main-row"),
          ]
            .map((tr) =>
              [
                ...tr.querySelectorAll("td"),
                [...tr.nextElementSibling?.classList]?.includes("details-row")
                  ? tr.nextElementSibling
                  : "",
              ].map((td) => td?.textContent?.trim())
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
          res[program.name][startYear.year][semester][specialization] =
            allCourses;
        }
      }
    }
  }
  fs.writeFile("output.json", JSON.stringify(res), console.log);
  // const studeinfoIndex = await fetchHtml(studeinfoIndexURL);
  // const dom = new JSDOM(studeinfoIndex);
  // console.log(dom.window.document.querySelector("p").textContent); // "Hello world"
})();
