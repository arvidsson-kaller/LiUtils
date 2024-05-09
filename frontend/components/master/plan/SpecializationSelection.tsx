import { CoursesResponseDTO } from "@/lib/backend-client";
import { Autocomplete, TextField } from "@mui/material";

export function SpecializationSelection({
  allCourses,
  selectedSpecialization,
  setSelectedSpecialization,
}: {
  allCourses: CoursesResponseDTO;
  selectedSpecialization: string;
  setSelectedSpecialization: (specialization: string) => void;
}) {
  const allSpecializations = [
    "None",
    ...Array.from(
      new Set(
        allCourses.data.semesters
          .map((semester) =>
            semester.specializations.map(
              (specialization) => specialization.name,
            ),
          )
          .flat(),
      ),
    ).sort((a, b) => a.localeCompare(b)),
  ];
  return (
    <>
      {allCourses && (
        <Autocomplete
          disablePortal
          id="specialization-selection"
          options={allSpecializations}
          sx={{ width: "100%" }}
          value={selectedSpecialization || null}
          renderInput={(params) => (
            <TextField {...params} label="Specialization" />
          )}
          onChange={(_, option) => setSelectedSpecialization(option!)}
        />
      )}
    </>
  );
}
