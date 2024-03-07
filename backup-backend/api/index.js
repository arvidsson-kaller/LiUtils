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

app.get("/course/:name", async (req, res) => {
  const { name } = req.params;
  const link = TE.searchLink(TE.TYPE.COURSES, {
    max: 1,
    search_text: name.replaceAll(".ics", ""),
  });
  const html = await fetchHtml(link);
  const courses = TE.parseSearch(html);
  const objectId = Object.values(courses)[0];
  const keyValues = [
    "h=t",
    "sid=3",
    "p=20240101.x,20240701.x",
    "objects=" + objectId,
  ];
  const url = TE.scrambleUrl(keyValues);
  if (name.endsWith(".ics")) {
    res.redirect(url.replaceAll(".html", ".ics"));
  } else {
    res.redirect(url);
  }
});

app.get("/room/:name", async (req, res) => {
  const { name } = req.params;
  const link = TE.searchLink(TE.TYPE.ROOMS, {
    max: 1,
    search_text: name.replaceAll(".ics", ""),
  });
  const html = await fetchHtml(link);
  const courses = TE.parseSearch(html);
  const objectId = Object.values(courses)[0];
  const keyValues = [
    "h=t",
    "sid=3",
    "p=20240101.x,20240701.x",
    "objects=" + objectId,
  ];
  const url = TE.scrambleUrl(keyValues);
  if (name.endsWith(".ics")) {
    res.redirect(url.replaceAll(".html", ".ics"));
  } else {
    res.redirect(url);
  }
});

app.listen(3001, () => console.log("Server ready on port 3000."));

module.exports = app;
