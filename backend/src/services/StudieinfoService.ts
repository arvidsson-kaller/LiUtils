import { useTransaction } from "@src/repos/Database";
import MasterProgramRepo from "@src/repos/MasterProgramRepo";
import StartYearRepo from "@src/repos/StartYearRepo";
import { getAllMasterData } from "common/dist/studieinfo";

export const populateStudieinfoData = async () => {
  const studieinfo = await getAllMasterData();
  useTransaction(async (client) => {
    for (const program of studieinfo.programs) {
      const createdMasterProgram = await MasterProgramRepo.create(
        {
          name: program.name,
        },
        client
      );
      for (const startYear of program.startYears) {
        await StartYearRepo.create(
          {
            name: startYear.name,
            data: JSON.stringify(startYear),
            masterProgramId: createdMasterProgram.id,
          },
          client
        );
      }
    }
    for (const masterProgram of await MasterProgramRepo.getAll(client)) {
      await MasterProgramRepo.deleteById(masterProgram.id);
    }
  });
};

export default {} as const;
