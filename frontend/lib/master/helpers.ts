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
