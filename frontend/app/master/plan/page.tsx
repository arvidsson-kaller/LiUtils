"use client";
import { ProxyBackendService } from "@/lib/backend";
import {
  CoursesResponseDTO,
  MasterProgramDTO,
  ProgramsResponseDTO,
  Semester,
  StartYearDTO,
  StartYearResponseDTO,
} from "@/lib/backend-client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  Modal,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";

export default function MasterPlan() {
  const [allPrograms, setAllPrograms] =
    React.useState<ProgramsResponseDTO | null>(null);
  const [allStartYears, setAllStartYears] =
    React.useState<StartYearResponseDTO | null>(null);
  const [allCourses, setAllCourses] = React.useState<CoursesResponseDTO | null>(
    null,
  );

  const [selectedProgram, setSelectedProgram] =
    React.useState<MasterProgramDTO | null>(null);
  const [selectedStartYear, setSelectedStartYear] =
    React.useState<StartYearDTO | null>(null);
  const [addedSemesters, setAddedSemesters] = React.useState<Semester[]>([]);

  React.useEffect(() => {
    ProxyBackendService.getAllPrograms().then(setAllPrograms);
  }, []);

  React.useEffect(() => {
    if (selectedProgram?.id) {
      setAllStartYears(null);
      setAddedSemesters([]);
      ProxyBackendService.getStartYears({
        programId: selectedProgram?.id,
      }).then(setAllStartYears);
    }
  }, [selectedProgram]);

  React.useEffect(() => {
    if (selectedStartYear?.id) {
      setAllCourses(null);
      setAddedSemesters([]);
      ProxyBackendService.getCourses({
        startYearId: selectedStartYear?.id,
      }).then(setAllCourses);
    }
  }, [selectedStartYear]);
  return (
    <Container
      sx={{
        display: "flex",
        bgcolor: "background.paper",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)",
        gap: 2,
      }}
    >
      <h1>Create Master Plan</h1>
      <ProgramAndStartYearSelection
        allPrograms={allPrograms}
        setSelectedProgram={setSelectedProgram}
        selectedProgram={selectedProgram}
        allStartYears={allStartYears}
        setSelectedStartYear={setSelectedStartYear}
      />
      <Semesters
        allSemesters={allCourses?.data?.semesters}
        addedSemesters={addedSemesters}
        setAddedSemesters={setAddedSemesters}
      />
    </Container>
  );
}

const StyledListItem = styled(ListItem)({
  width: "100%",
});

function Semesters({
  allSemesters,
  addedSemesters,
  setAddedSemesters,
}: {
  allSemesters: Semester[] | undefined;
  addedSemesters: Semester[];
  setAddedSemesters: React.Dispatch<React.SetStateAction<Semester[]>>;
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  if (!allSemesters) return <></>;
  return (
    <>
      <h3>Semesters</h3>
      <List sx={{ width: "100%" }}>
        {addedSemesters.map((semester, i) => (
          <StyledListItem key={`list-semester-${i}`}>
            <Accordion sx={{ width: "100%" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {semester.name}
              </AccordionSummary>
              <AccordionDetails>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </AccordionDetails>
            </Accordion>
          </StyledListItem>
        ))}
        {allSemesters.length > addedSemesters.length && (
          <StyledListItem>
            <Button variant="contained" color="success" onClick={handleOpen}>
              <AddIcon />
              Add Semester
            </Button>
          </StyledListItem>
        )}
      </List>
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40vw",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select semester to add
          </Typography>
          {allSemesters
            .filter((semester) => !addedSemesters.includes(semester))
            .map((semester, i) => (
              <Button
                onClick={() =>
                  setAddedSemesters(
                    [...addedSemesters, semester].sort(
                      (a, b) =>
                        allSemesters.indexOf(a) - allSemesters.indexOf(b),
                    ),
                  )
                }
                key={`semester-add-${i}`}
                variant="outlined"
                color="inherit"
              >
                {semester.name}
                <AddIcon />
              </Button>
            ))}
        </Box>
      </Modal>
    </>
  );
}

function ProgramAndStartYearSelection({
  allPrograms,
  setSelectedProgram,
  selectedProgram,
  allStartYears: allStartYears,
  setSelectedStartYear,
}: {
  allPrograms: ProgramsResponseDTO | null;
  setSelectedProgram: React.Dispatch<
    React.SetStateAction<MasterProgramDTO | null>
  >;
  selectedProgram: MasterProgramDTO | null;
  allStartYears: StartYearResponseDTO | null;
  setSelectedStartYear: React.Dispatch<
    React.SetStateAction<StartYearDTO | null>
  >;
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
          renderInput={(params) => <TextField {...params} label="Program" />}
          onChange={(_, option) => setSelectedProgram(option)}
          getOptionLabel={(opt) => opt.name}
        />
      ) : (
        <CircularProgress />
      )}
      {selectedProgram &&
        (allStartYears ? (
          <Autocomplete
            disablePortal
            id="program-selection"
            options={allStartYears.startYears.sort((a, b) =>
              b.name.localeCompare(a.name),
            )}
            sx={{ width: "100%" }}
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
