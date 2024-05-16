import {
  MasterProgramDTO,
  ProgramsResponseDTO,
  StartYearDTO,
  StartYearResponseDTO,
} from "@/lib/backend-client";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

export function ProgramAndStartYearSelection({
  allPrograms,
  setSelectedProgram,
  selectedProgram,
  allStartYears,
  setSelectedStartYear,
  selectedStartYear,
}: {
  allPrograms: ProgramsResponseDTO | null;
  setSelectedProgram: (program: MasterProgramDTO | null) => void;
  selectedProgram: MasterProgramDTO | null;
  allStartYears: StartYearResponseDTO | null;
  setSelectedStartYear: (startYear: StartYearDTO | null) => void;
  selectedStartYear: StartYearDTO | null;
}) {
  return (
    <>
      {allPrograms ? (
        <Autocomplete
          disablePortal
          id="program-selection"
          options={allPrograms.programs.sort((a, b) =>
            a.name.localeCompare(b.name),
          )}
          sx={{ width: "100%" }}
          value={selectedProgram || null}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          renderInput={(params) => <TextField {...params} label="Program" />}
          onChange={(_, option) => setSelectedProgram(option)}
          getOptionLabel={(opt) => opt.name}
        />
      ) : (
        <CircularProgress />
      )}
      {selectedProgram &&
        selectedProgram.id != -1 &&
        (allStartYears ? (
          <Autocomplete
            disablePortal
            id="program-selection"
            options={allStartYears.startYears.sort((a, b) =>
              b.name.localeCompare(a.name),
            )}
            sx={{ width: "100%" }}
            value={selectedStartYear || null}
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            renderInput={(params) => (
              <TextField {...params} label="Start Year" />
            )}
            onChange={(_, option) => setSelectedStartYear(option)}
            getOptionLabel={(opt) => opt.name}
          />
        ) : (
          <CircularProgress />
        ))}
    </>
  );
}
