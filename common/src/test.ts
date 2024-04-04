import common from "./index";
import { strict as assert } from "assert";

console.log("Common includes:\n", common);

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

(async () => {
  const TE = common.timeedit;

  const courseLink = TE.searchLink(TE.TYPE.COURSES, {
    max: 1,
    search_text: "tddd27",
  });
  assert(
    courseLink ===
      "https://cloud.timeedit.net/liu/web/schema/objects.html?partajax=t&sid=3&objects=&types=219&fe=132.0&max=1&search_text=tddd27",
  );
  console.log("Please verify the following link works: ", courseLink);
  const html = await fetchHtml(courseLink);
  const objectId = Object.values(TE.parseSearch(html))[0];
  assert(objectId === "786189.219");
  const keyValues: string[] = [
    "h=t",
    "sid=3",
    "p=20240101.x,20240701.x",
    "objects=" + objectId,
  ];
  const url = TE.scrambleUrl(keyValues);
  console.log("Please verify the following link works: ", url);
  assert(
    url ===
      "https://cloud.timeedit.net/liu/web/schema/ri107826X55Z04Q6Z56g3Y80y0046Y53201gQY6Q55.html",
  );

  const link1 = TE.searchLink(TE.TYPE.ROOMS, {});
  console.log("Please verify the following link works: ", link1);
  await fetchHtml(link1);

  const link2 = TE.searchLink(TE.TYPE.COURSES, {
    institutions: [TE.INSTITUTIONS.IDA, TE.INSTITUTIONS.ISY],
    campus: [TE.CAMPUS.VALLA],
  });
  console.log("Please verify the following link works: ", link2);
  await fetchHtml(link2);
})();
