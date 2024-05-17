import { Ecv } from "../backend-client";

export const ecvLabel = (ecv: Ecv) => {
  switch (ecv) {
    case "C":
      return "compulsory";
    case "C/E":
      return "compulsory/elective";
    case "E":
      return "elective";
    case "V":
      return "voluntary";
  }
};

export const specLabel = (specName: string) => {
  return specName.replace("Specialisation: ", "");
};

export function stringToColor(str: string) {
  var crc32 = function (r: string) {
    for (var a, o = [], c = 0; c < 256; c++) {
      a = c;
      for (var f = 0; f < 8; f++) a = 1 & a ? 3988292384 ^ (a >>> 1) : a >>> 1;
      o[c] = a;
    }
    for (var n = -1, t = 0; t < r.length; t++)
      n = (n >>> 8) ^ o[255 & (n ^ r.charCodeAt(t))];
    return (-1 ^ n) >>> 0;
  };
  let hexcode = crc32(str).toString(16).slice(-6);
  return "#" + (hexcode.length == 6 ? hexcode : hexcode.padEnd(6, "0"));
}

export function getTextColorFromBackground(hex: string): string {
  hex = hex.replace(/^#/, "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "black" : "white";
}

export function longStringToColor(str: string): string {
  // This function returns more beautiful colors for long strings
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hex = "#" + ((hash & 0x00ffffff) + 0x1000000).toString(16).slice(1); // Ensure leading zeros
  return hex;
}
