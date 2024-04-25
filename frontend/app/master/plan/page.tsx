"use client";
import { ProxyBackendService } from "@/lib/backend";
import {
  CoursesResponseDTO,
  MasterPlan,
  MasterProgramDTO,
  PeriodName,
  PlannedCourseSpecialization,
  ProgramsResponseDTO,
  Semester,
  SemesterPlan,
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
  ListSubheader,
  Modal,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { CourseSelectionGrid } from "@/components/master/CourseSelectionGrid";

export default function MasterPlanPage() {
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

  const [currentPlan, setCurrentPlan] = React.useState<MasterPlan>({
    programName: "",
    startYear: "",
    semesters: [],
    specializion: "",
    note: "",
  });

  React.useEffect(() => {
    ProxyBackendService.getAllPrograms().then(setAllPrograms);
  }, []);

  React.useEffect(() => {
    if (selectedProgram?.id) {
      setAllStartYears(null);
      setAddedSemesters([]);
      setCurrentPlan((oldPlan) => {
        return { ...oldPlan, programName: selectedProgram.name };
      });
      ProxyBackendService.getStartYears({
        programId: selectedProgram?.id,
      }).then(setAllStartYears);
    }
  }, [selectedProgram]);

  React.useEffect(() => {
    if (selectedStartYear?.id) {
      setAllCourses(null);
      setAddedSemesters([]);
      setCurrentPlan((oldPlan) => {
        return { ...oldPlan, startYear: selectedStartYear.name };
      });
      ProxyBackendService.getCourses({
        startYearId: selectedStartYear?.id,
      }).then(setAllCourses);
    }
  }, [selectedStartYear]);

  const addOrUpdateSemesterPlan = React.useCallback(
    (semesterPlan: SemesterPlan) => {
      if (!currentPlan) {
        console.error("Current plan is uninitialized");
        return;
      }
      const currentPlanCopy = structuredClone(currentPlan);
      if (!currentPlanCopy?.semesters) {
        currentPlanCopy.semesters = [];
      }
      const existingIndex = currentPlanCopy.semesters.findIndex(
        (semester) => semester.name === semesterPlan.name,
      );
      if (existingIndex !== -1) {
        currentPlanCopy.semesters[existingIndex] = semesterPlan;
      } else {
        currentPlanCopy.semesters.push(semesterPlan);
      }
      setCurrentPlan(currentPlanCopy);
    },
    [currentPlan],
  );
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
      {selectedStartYear &&
        (allCourses ? (
          <Semesters
            allSemesters={allCourses?.data?.semesters}
            addedSemesters={addedSemesters}
            setAddedSemesters={setAddedSemesters}
            addOrUpdateSemesterPlan={addOrUpdateSemesterPlan}
            currentPlan={currentPlan}
          />
        ) : (
          <CircularProgress />
        ))}
    </Container>
  );
}

const StyledListItem = styled(ListItem)({
  width: "100%",
});

const ModalBox = styled(Box)({
  position: "absolute",
  top: "10vh",
  left: "10vw",
  backfaceVisibility: "hidden",
  width: "80vw",
  backgroundColor: "white",
  padding: "1.5em",
  borderRadius: "3px",
  display: "flex",
  flexDirection: "column",
  gap: 1,
});

function Courses({
  currentSemester,
  allSemesters,
  addOrUpdateSemesterPlan,
  currentPlan,
}: {
  currentSemester: Semester;
  allSemesters: Semester[];
  addOrUpdateSemesterPlan: (semesterPlan: SemesterPlan) => void;
  currentPlan: MasterPlan;
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const [semesterPlan, setSemesterPlan] = React.useState<SemesterPlan>();

  React.useEffect(() => {
    const semPlan: SemesterPlan = { name: currentSemester.name, periods: [] };
    const periods = new Set<PeriodName>();
    for (const specialization of currentSemester.specializations) {
      for (const period of specialization.periods) {
        periods.add(period.name);
      }
    }
    for (const uniquePeriod of Array.from(periods)) {
      semPlan.periods.push({ name: uniquePeriod, courses: [] });
    }
    setSemesterPlan(semPlan);
  }, [currentSemester]);

  const updateSemesterPlan = (semesterPlan: SemesterPlan) => {
    setSemesterPlan(semesterPlan);
    addOrUpdateSemesterPlan(semesterPlan);
  };

  return (
    <Box>
      <h4>Selected Courses</h4>
      <pre>
        {JSON.stringify(
          currentPlan.semesters.find(
            (semester) => semester.name === currentSemester.name,
          )?.periods,
          null,
          4,
        )}
      </pre>
      <Button variant="contained" color="success" onClick={handleOpen}>
        <AddIcon />
        Add Course
      </Button>
      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox sx={{ overflow: "auto", maxHeight: "80svh", width: "80vw" }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select course to add
          </Typography>
          <List
            dense
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              maxHeight: "100%",
            }}
            subheader={<li />}
          >
            {allSemesters.map((semester, semIndex) => (
              <li key={`semester-${semester.name}-${semIndex}`}>
                <ul>
                  <Accordion
                    sx={{ width: "100%" }}
                    defaultExpanded={currentSemester.name === semester.name}
                    slotProps={{ transition: { unmountOnExit: true } }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      {semester.name}
                    </AccordionSummary>
                    <AccordionDetails>
                      {semester.specializations.map(
                        (specialization, specIndex) => (
                          <li
                            key={`specialization-${specialization.name}-${specIndex}`}
                          >
                            <ul>
                              <ListSubheader
                                disableSticky
                              >{`${specialization.name}`}</ListSubheader>
                              {specialization.periods.map(
                                (period, perIndex) => (
                                  <li
                                    key={`period-${specialization.name}-${perIndex}`}
                                  >
                                    <ul>
                                      <ListSubheader
                                        disableSticky
                                      >{`${period.name}`}</ListSubheader>
                                      <CourseSelectionGrid
                                        courses={period.courses}
                                        onCourseAdd={(course) => {
                                          if (!semesterPlan) {
                                            return;
                                          }
                                          const semesterPlanCopy =
                                            structuredClone(semesterPlan);
                                          const plannedSpecializations: PlannedCourseSpecialization[] =
                                            [];
                                          for (const spec of semester.specializations) {
                                            for (const per of spec.periods) {
                                              let wasCourseFound = false;
                                              for (const cor of per.courses) {
                                                if (
                                                  cor.courseCode ===
                                                  course.courseCode
                                                ) {
                                                  plannedSpecializations.push({
                                                    name: spec.name,
                                                    ECV: cor.ECV,
                                                  });
                                                  wasCourseFound = true;
                                                  break;
                                                }
                                              }
                                              if (wasCourseFound) {
                                                break;
                                              }
                                            }
                                          }
                                          semesterPlanCopy.periods
                                            .find((p) => p.name === period.name)
                                            ?.courses.push({
                                              ...course,
                                              semester:
                                                currentSemester.name ===
                                                semester.name
                                                  ? null
                                                  : semester.name,
                                              note: "",
                                              specializations:
                                                plannedSpecializations,
                                            });
                                          updateSemesterPlan(semesterPlanCopy);
                                        }}
                                      />
                                    </ul>
                                  </li>
                                ),
                              )}
                            </ul>
                          </li>
                        ),
                      )}
                    </AccordionDetails>
                  </Accordion>
                </ul>
              </li>
            ))}
          </List>
        </ModalBox>
      </Modal>
    </Box>
  );
}

function Semesters({
  allSemesters,
  addedSemesters,
  setAddedSemesters,
  addOrUpdateSemesterPlan,
  currentPlan,
}: {
  allSemesters: Semester[] | undefined;
  addedSemesters: Semester[];
  setAddedSemesters: React.Dispatch<React.SetStateAction<Semester[]>>;
  addOrUpdateSemesterPlan: (semesterPlan: SemesterPlan) => void;
  currentPlan: MasterPlan;
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
                <Courses
                  currentSemester={semester}
                  allSemesters={allSemesters}
                  addOrUpdateSemesterPlan={addOrUpdateSemesterPlan}
                  currentPlan={currentPlan}
                />
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
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox>
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
        </ModalBox>
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
