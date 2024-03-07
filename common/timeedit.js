const fetch = require('node-fetch');

const TimeeditTypes = {
    COURSES: 219,
    CLASSES: 205,
    ROOMS: 195,
}

const TimeeditFilter = {
    ROOMS: 11,
    CAMPUS: 23,
    HOUSE: 26,
    INSTITUTION: 58,
}

const TimeeditRoomType = {
    LINUX: 'Datorsal%20Linux',
    MAC: 'Datorsal%20mac',
    WINDOWS: 'Datorsal%20Windows',
    COMPUTERS: `Datorsal%20Linux,Datorsal%20mac,Datorsal%20Windows`,
    LECTURE: 'Gradängsal,Flexi%20sal',
    STANDARD: 'Platt%20sal,ALC',
    GROUP: 'Grupprum',
    LABB: 'Labbsal',
}

const TimeeditCampus = {
    VALLA: 'Valla',
}

const TimeeditHouses = {
    A: 'A-huset',
    B: 'B-huset',
    C: 'C-huset',
    D: 'D-huset',
    E: 'E-huset',
    FYSIK: 'Fysikhuset',
    G: 'G-Huset',
    I: 'I-huset%2C%201%20%26%202,I-huset%2C%203',
    KEY: 'Key',
    STUDENT: 'Studenthuset',
    VALLFARTEN: 'Vallfarten',
}

const TimeeditInstitutions = {
    BKV: 'BKV',
    CE: 'CE',
    CLI: 'Clinicum',
    DRS: 'DRS',
    FFK: 'FFK',
    GEL: 'GEL',
    GEM: 'GEM',
    HMV: 'HMV',
    IBL: 'IBL',
    IDA: 'IDA',
    IEI: 'IEI',
    IFM: 'IFM',
    IFSA: 'IFSA',
    IKE: 'IKE',
    IKK: 'IKK',
    IKOS: 'IKOS',
    IMH: 'IMH',
    IMT: 'IMT',
    ISAK: 'ISAK',
    ISV: 'ISV',
    ISY: 'ISY',
    ITN: 'ITN',
    KALMAR: 'KALMAR',
    KFU: 'KFU',
    KS: 'KS',
    LIULOK1: 'LIULOK1',
    LIULOK2: 'LIULOK2',
    LOKE3: 'LOKE%203',
    LOTS: 'LOTS',
    MAI: 'MAI',
    med: 'med',
    MEDFAK: 'MEDFAK',
    SENIOR: 'SENIOR',
    SPECIAL: 'SPECIAL',
    STUDENT: 'STUDENT',
    STUDORG: 'STUDORG',
    TEMA: 'TEMA',
    TEST: 'TEST',
    TFK: 'TFK',
    UB: 'UB',
    UF: 'UF',
    ULED: 'ULED',
    ULIU: 'ULIU',
    ÖVR: 'ÖVR',
}

const searchTimeedit = (type, {
    max = null,
    search_text = null,
    roomtypes = null,
    houses = null,
    institutions = null,
    campus = null
}) => {
    let url = `https://cloud.timeedit.net/liu/web/schema/objects.html?partajax=t&sid=3&objects=&types=${type}&fe=132.0`;
    url += max != null ? `&max=${max}` : "";
    url += roomtypes !== null ? `&fe=${TimeeditFilter.ROOMS}.${roomtypes.join(',')}` : "";
    url += institutions !== null ? `&fe=${TimeeditFilter.INSTITUTION}.${institutions.join(',')}` : "";
    url += houses !== null ? `&fe=${TimeeditFilter.HOUSE}.${houses.join(',')}` : "";
    url += campus != null ? `&fe=${TimeeditFilter.CAMPUS}.${campus.join(',')}` : "";
    url += search_text != null ? `&search_text=${search_text}` : "";
    return url;
}

const fetchObjectIdFromCourseCode = (course) => {
    return new Promise((resolve, reject) => {
        const url = `https://cloud.timeedit.net/liu/web/schema/objects.html?max=1&partajax=t&sid=3&objects=&types=219&fe=132.0&search_text=${course}`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data from the server. Status: ${response.status}`);
                }
                return response.text();
            })
            .then((htmlData) => {
                const regex = /data-id="(\d+\.\d+)"/g;
                const dataIds = [];
                let match;

                while ((match = regex.exec(htmlData)) !== null) {
                    dataIds.push(match[1]);
                }

                resolve(dataIds[0]);
            })
            .catch((error) => {
                console.error(error);
            });
    })
}

const asURL = (baseUrl, keyValues, extra) => {
    // help functions
    const toString = (string) => {
        if (isEmpty(string)) {
            return "";
        }
        return `${string}`;
    };
    const isEmpty = (str) => !str || str.length === 0;
    const tabledata = [
        ["h=t&sid=", "6="],
        ["objects=", "1="],
        ["sid=", "2="],
        ["&ox=0&types=0&fe=0", "3=3"],
        ["&types=0&fe=0", "5=5"],
        ["&h=t&p=", "4="]
    ];
    const tabledataspecial = [
        ["=", "ZZZX1"],
        ["&", "ZZZX2"],
        [",", "ZZZX3"],
        [".", "ZZZX4"],
        [" ", "ZZZX5"],
        ["-", "ZZZX6"],
        ["/", "ZZZX7"],
        ["%", "ZZZX8"]
    ];
    const pairs = [
        ["=", "Q"],
        ["&", "Z"],
        [",", "X"],
        [".", "Y"],
        [" ", "V"],
        ["-", "W"]
    ];
    const pattern = [
        4, 22, 5, 37, 26, 17, 33, 15, 39, 11, 45, 20, 2, 40, 19, 36, 28, 38, 30, 41, 44,
        42, 7, 24, 14, 27, 35, 25, 12, 1, 43, 23, 6, 16, 3, 9, 47, 46, 48, 50, 21, 10, 49,
        32, 18, 31, 29, 34, 13, 8
    ];
    const tablespecial = (result) => {
        for (let i = 0; i < 100; i++) {
            for (const key of tabledataspecial) {
                result = result.replace(key[0], key[1]);
            }
        }
        return result;
    };
    const tableshort = (result) => {
        for (const key of tabledata) {
            result = result.replace(key[0], key[1]);
        }
        return result;
    };
    const modKey = (ch) => {
        if (ch >= 97 && ch <= 122) {
            return 97 + (ch - 88) % 26;
        }
        if (ch >= 49 && ch <= 57) {
            return 49 + (ch - 45) % 9;
        }
        return ch;
    };
    const scrambleChar = (ch) => {
        for (const pair of pairs) {
            if (ch === pair[0]) {
                return pair[1];
            }
            if (ch === pair[1]) {
                return pair[0];
            }
        }
        return String.fromCharCode(modKey(ch.charCodeAt(0)));
    };
    const swap = (result, from, to) => {
        if (from < 0 || from >= result.length || to < 0 || to >= result.length) {
            return;
        }
        const fromChar = result[from];
        result[from] = result[to];
        result[to] = fromChar;
    };
    const swapPattern = (result) => {
        const steps = Math.ceil(result.length / pattern.length);
        for (let step = 0; step < steps; step++) {
            for (let index = 1; index < pattern.length; index += 2) {
                swap(result, pattern[index] + step * pattern.length, pattern[index - 1] + step * pattern.length);
            }
        }
    };
    const swapChar = (result) => {
        const split = result.split("");
        for (let index = 0; index < split.length; index++) {
            split[index] = scrambleChar(split[index]);
        }
        swapPattern(split);
        return split.join("");
    };
    const scramble = (query) => {
        if (isEmpty(query) || query.length < 2 || query.substring(0, 2) === "i=") {
            return query;
        }
        let result = decodeURIComponent(query);
        result = tableshort(result);
        result = swapChar(result);
        result = tablespecial(result);
        return encodeURIComponent(result);
    };

    // beginning of function
    const url = baseUrl;
    keyValues = keyValues.map((value) => toString(value).replace(/[+]/g, " "));

    const lastSlash = toString(url).lastIndexOf("/");
    const page = url.substring(lastSlash + 1, url.length);
    if (page.indexOf("r") !== 0) {
        return `${url}?i=${scramble(keyValues.join("&") + toString(extra))}`;
    }
    let dot = ".html";
    const lastDot = toString(url).lastIndexOf(".");
    if (lastDot !== -1) {
        dot = url.substring(lastDot, url.length);
    }
    let modifiedURL = url;
    if (lastSlash !== -1) {
        modifiedURL = url.substring(0, lastSlash + 1);
    }
    return `${modifiedURL}ri${scramble(keyValues.join("&") + toString(extra))}${dot}`;
};

module.exports = {
    fetchObjectIdFromCourseCode,
    timeeditScamble: asURL,
    TimeeditRoomType,
    searchTimeedit,
    TimeeditCampus,
    TimeeditHouses,
    TimeeditTypes,
    TimeeditInstitutions
}