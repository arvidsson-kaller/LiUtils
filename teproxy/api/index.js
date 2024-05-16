const express = require("express");
const TE = require("common").default.timeedit;
const app = express();

const fetchHtml = (url) => {
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

function getPeriodByDate() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // January 1st of the current year
  const januaryFirst = new Date(currentYear, 0, 1);
  // July 1st of the current year
  const julyFirst = new Date(currentYear, 6, 1);

  if (currentDate >= januaryFirst && currentDate < julyFirst) {
    return `p=${currentYear}0101.x,${currentYear}0701.x`;
  } else {
    return `p=${currentYear}0701.x,${currentYear + 1}0701.x`;
  }
}

function objectIdRedirectUrl(objectIds, ext) {
  const keyValues = [
    "h=t",
    "sid=3",
    getPeriodByDate(),
    "objects=" + objectIds.join(","),
  ];

  const url = TE.scrambleUrl(keyValues);
  if (ext === "html") {
    return url;
  } else {
    return url.replaceAll(".html", ".ics");
  }
}

app.get("/:codes", async (req, res) => {
  const [codes, ext = "html"] = req.params.codes.split(".");
  const courses = codes.split("+");
  const objectIds = await Promise.all(
    courses.map(async (course) => {
      const link = TE.searchLink(TE.TYPE.COURSES, {
        max: 1,
        search_text: course,
      });
      const html = await fetchHtml(link);
      const objectIds = TE.parseSearch(html);
      return Object.values(objectIds)[0] ?? 0;
    }),
  );

  console.log("Found ", { courses, objectIds });

  res.redirect(objectIdRedirectUrl(objectIds, ext));
});

app.get("/room/:codes", async (req, res) => {
  const [codes, ext = "html"] = req.params.codes.split(".");
  const rooms = codes.split("+");
  const objectIds = await Promise.all(
    rooms.map(async (room) => {
      const link = TE.searchLink(TE.TYPE.ROOMS, {
        max: 1,
        search_text: room,
      });
      const html = await fetchHtml(link);
      const objectIds = TE.parseSearch(html);
      return Object.values(objectIds)[0] ?? 0;
    }),
  );

  console.log("Found ", { rooms, objectIds });

  res.redirect(objectIdRedirectUrl(objectIds, ext));
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/docs.html");
});

app.listen(3001, () => console.log("Server ready on port 3001."));

module.exports = app;
