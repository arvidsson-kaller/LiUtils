const common = require("./index")
const assert = require('node:assert').strict;
const querystring = require('querystring')

console.log(common);

(async () => {
    const objectId = await common.fetchObjectIdFromCourseCode('tddd27');
    assert(objectId === '786189.219');

    let keyValues = [
        "h=t",
        "sid=3",
        "p=20240101.x,20240701.x",
        "objects=" + objectId,
        "ox=0",
        "types=0",
        "fe=0"
    ];

    let urls =
        "https://cloud.timeedit.net/liu/web/schema/ri.html";

    let url = common.timeeditScamble(urls, keyValues);
    assert(url === 'https://cloud.timeedit.net/liu/web/schema/ri107826X55Z04Q6Z56g3Y80y0046Y53Q01gQY6Q55727.html')

    const link1 = common.searchTimeedit(common.TimeeditTypes.ROOMS, {
        roomtypes: [common.TimeeditRoomType.STANDARD],
        houses: [common.TimeeditHouses.C]
    });
    console.log(link1);

    const link2 = common.searchTimeedit(common.TimeeditTypes.COURSES, {
        institutions: [common.TimeeditInstitutions.IDA, common.TimeeditInstitutions.ISY],
        campus: [common.TimeeditCampus.VALLA]
    });
    console.log(link2);
})()