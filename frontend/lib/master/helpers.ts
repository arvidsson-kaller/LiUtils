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

export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  return `rgb(${r},${g},${b})`;
}
