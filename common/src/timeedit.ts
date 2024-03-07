import {
  CAMPUS,
  FILTER,
  HOUSE,
  INSTITUTIONS,
  ROOMTYPE,
  TYPE,
  URL,
} from "./timeeditConstants";

export { CAMPUS, HOUSE, INSTITUTIONS, ROOMTYPE, TYPE };

interface TimeeditSearchOptions {
  max?: number | null;
  search_text?: string | null;
  roomtypes?: string[] | null;
  houses?: string[] | null;
  institutions?: string[] | null;
  campus?: string[] | null;
}

interface TimeeditUrlOptions {
  baseUrl: string;
  keyValues: string[];
  extra?: string;
}

export const searchLink = (
  type: number,
  {
    max = null,
    search_text = null,
    roomtypes = null,
    houses = null,
    institutions = null,
    campus = null,
  }: TimeeditSearchOptions,
): string => {
  let url = `${URL.OBJECTS}?partajax=t&sid=3&objects=&types=${type}&fe=132.0`;
  url += max !== null ? `&max=${max}` : "";
  url += roomtypes !== null ? `&fe=${FILTER.ROOMS}.${roomtypes.join(",")}` : "";
  url +=
    institutions !== null
      ? `&fe=${FILTER.INSTITUTION}.${institutions.join(",")}`
      : "";
  url += houses !== null ? `&fe=${FILTER.HOUSE}.${houses.join(",")}` : "";
  url += campus !== null ? `&fe=${FILTER.CAMPUS}.${campus.join(",")}` : "";
  url += search_text !== null ? `&search_text=${search_text}` : "";
  return url;
};

export const parseSearch = (html: string): Record<string, string> => {
  const objectIdRegex = /data-id="(\d+\.\d+)"/g;
  const nameRegex = /data-name="([^"]*)"/g;
  const result: Record<string, string> = {};

  let objectIdMatch;
  let nameMatch;

  while (
    (objectIdMatch = objectIdRegex.exec(html)) !== null &&
    (nameMatch = nameRegex.exec(html)) !== null
  ) {
    result[nameMatch[1]] = objectIdMatch[1];
  }
  return result;
};

export const scrambleUrl = (keyValues: any): string => {
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
    ["&h=t&p=", "4="],
  ];
  const tabledataspecial = [
    ["=", "ZZZX1"],
    ["&", "ZZZX2"],
    [",", "ZZZX3"],
    [".", "ZZZX4"],
    [" ", "ZZZX5"],
    ["-", "ZZZX6"],
    ["/", "ZZZX7"],
    ["%", "ZZZX8"],
  ];
  const pairs = [
    ["=", "Q"],
    ["&", "Z"],
    [",", "X"],
    [".", "Y"],
    [" ", "V"],
    ["-", "W"],
  ];
  const pattern = [
    4, 22, 5, 37, 26, 17, 33, 15, 39, 11, 45, 20, 2, 40, 19, 36, 28, 38, 30, 41,
    44, 42, 7, 24, 14, 27, 35, 25, 12, 1, 43, 23, 6, 16, 3, 9, 47, 46, 48, 50,
    21, 10, 49, 32, 18, 31, 29, 34, 13, 8,
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
      return 97 + ((ch - 88) % 26);
    }
    if (ch >= 49 && ch <= 57) {
      return 49 + ((ch - 45) % 9);
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
        swap(
          result,
          pattern[index] + step * pattern.length,
          pattern[index - 1] + step * pattern.length,
        );
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
  const url = URL.SCHEMA;
  keyValues = keyValues.map((value) => toString(value).replace(/[+]/g, " "));

  const lastSlash = toString(url).lastIndexOf("/");
  const page = url.substring(lastSlash + 1, url.length);
  if (page.indexOf("r") !== 0) {
    return `${url}?i=${scramble(keyValues.join("&"))}`;
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
  return `${modifiedURL}ri${scramble(keyValues.join("&"))}${dot}`;
};
