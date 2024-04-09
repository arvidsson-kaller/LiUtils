import { MasterPrograms } from "@/common/dist/studieinfo";
import studieinfo from "../app/api/studieinfo/studieinfo.json";

export const getStudieInfo = (): MasterPrograms => studieinfo as MasterPrograms;
