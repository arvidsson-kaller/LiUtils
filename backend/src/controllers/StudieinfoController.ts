import { Controller, Get, Patch, Path, Route, Security } from "tsoa";
import { populateStudieinfoData } from "@src/services/StudieinfoService";
import MasterProgram, { MasterProgramId } from "@src/models/MasterProgram";
import MasterProgramRepo, {
  ReducedStartYear,
} from "@src/repos/MasterProgramRepo";
import { StartYearId } from "@src/models/StartYear";
import StartYearRepo from "@src/repos/StartYearRepo";
import { StartYear } from "common/dist/studieinfo";

@Route("studieinfo")
export class StudieinfoController extends Controller {
  @Security("api_key")
  @Patch()
  public async populateData() {
    await populateStudieinfoData();
  }
  @Get("/programs")
  public async getAllPrograms(): Promise<ProgramsResponseDTO> {
    const programs = await MasterProgramRepo.getAll();
    const programDTOs = programs.map(mapMasterProgramToDTO);
    return {
      programs: programDTOs,
    };
  }
  @Get("/startyear/{programId}")
  public async getStartYears(
    @Path() programId: number,
  ): Promise<StartYearResponseDTO> {
    const program = await MasterProgramRepo.findById(
      programId as MasterProgramId,
    );
    const startYears = await MasterProgramRepo.getStartYearsById(
      programId as MasterProgramId,
    );
    const startYearDTOs = startYears.map(mapStartYearToDTO);
    return {
      programName: program.name,
      startYears: startYearDTOs,
    };
  }
  @Get("/courses/{startYearId}")
  public async getCourses(@Path() startYearId: number): Promise<CoursesDTO> {
    const startYear = await StartYearRepo.findById(startYearId as StartYearId);
    return {
      data: startYear,
    };
  }
}

interface CoursesDTO {
  data: StartYear;
}

interface StartYearDTO {
  id: number;
  name: string;
}

export const mapStartYearToDTO = (
  startYear: ReducedStartYear,
): StartYearDTO => {
  return {
    id: startYear.id,
    name: startYear.name,
  };
};

interface StartYearResponseDTO {
  programName: string;
  startYears: StartYearDTO[];
}

interface MasterProgramDTO {
  id: number;
  name: string;
}

export const mapMasterProgramToDTO = (
  program: MasterProgram,
): MasterProgramDTO => {
  return {
    id: program.id,
    name: program.name,
  };
};

interface ProgramsResponseDTO {
  programs: MasterProgramDTO[];
}
