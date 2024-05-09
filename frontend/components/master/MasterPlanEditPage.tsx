"use client";
import { ProxyBackendService } from "@/lib/backend";
import {
  Course,
  CoursesResponseDTO,
  MasterPlan,
  MasterPlanResponseDTO,
  MasterProgramDTO,
  Period,
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
  Card,
  CardContent,
  CircularProgress,
  Container,
  Fab,
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
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { CourseSelectionGrid } from "@/components/master/CourseSelectionGrid";
import { SemesterPlanOverview } from "@/components/master/SemesterPlanOverview";
import { CourseSelectionSummary } from "@/components/master/CourseSelectionSummary";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function MasterPlanEditPage({
  allPrograms,
  id,
  loadedPlan,
  loadedStartYears,
  loadedAllCourses,
}: {
  allPrograms: ProgramsResponseDTO;
  id?: string | null;
  loadedPlan?: MasterPlanResponseDTO | null;
  loadedStartYears?: StartYearResponseDTO | null;
  loadedAllCourses?: CoursesResponseDTO | null;
}) {
  const [allStartYears, setAllStartYears] =
    React.useState<StartYearResponseDTO | null>(loadedStartYears || null);
  const [allCourses, setAllCourses] = React.useState<CoursesResponseDTO | null>(
    loadedAllCourses || null,
  );

  const [planTitle, setPlanTitle] = React.useState<string>(
    loadedPlan?.title || "My Master Plan",
  );
  const [selectedProgram, setSelectedProgram] =
    React.useState<MasterProgramDTO | null>(loadedPlan?.plan?.program || null);
  const [selectedStartYear, setSelectedStartYear] =
    React.useState<StartYearDTO | null>(loadedPlan?.plan?.startYear || null);
  const [selectedSpecialization, setSelectedSpecialization] =
    React.useState<string>(loadedPlan?.plan?.specialization || "");
  const [addedSemesters, setAddedSemesters] = React.useState<Semester[]>([]);

  const [currentPlan, setCurrentPlan] = React.useState<MasterPlan>(
    loadedPlan?.plan || {
      program: { name: "", id: -1 },
      startYear: { name: "", id: -1 },
      semesters: [],
      specialization: "",
      note: "",
    },
  );

  React.useEffect(() => {
    if (!loadedPlan) {
      const savedPlanString = localStorage.getItem("savedPlan");
      if (savedPlanString) {
        const savedPlan = JSON.parse(savedPlanString);
        setPlanTitle(savedPlan.title);
        setCurrentPlan(savedPlan.plan);
        setSelectedProgram(savedPlan.plan.program);
        ProxyBackendService.getStartYears({
          programId: savedPlan.plan.program.id,
        }).then(setAllStartYears);
        if (savedPlan.plan.startYear.id !== -1) {
          setSelectedStartYear(savedPlan.plan.startYear);
          ProxyBackendService.getCourses({
            startYearId: savedPlan.plan.startYear.id,
          }).then(setAllCourses);
        }
        setSelectedSpecialization(savedPlan.plan.specialization);
      }
    }
  }, [loadedPlan]);

  React.useEffect(() => {
    if (currentPlan.program.id !== -1) {
      localStorage.setItem(
        "savedPlan",
        JSON.stringify({ title: planTitle, plan: currentPlan }),
      );
    }
  }, [currentPlan, planTitle]);

  const updateSelectedProgram = (program: MasterProgramDTO) => {
    setSelectedProgram(program);
    setAllStartYears(null);
    setAllCourses(null);
    setSelectedStartYear(null);
    setAddedSemesters([]);
    setCurrentPlan((oldPlan) => {
      return {
        ...oldPlan,
        program: program,
        specialization: "",
        startYear: { name: "", id: -1 },
        semesters: [],
      };
    });
    ProxyBackendService.getStartYears({
      programId: program.id,
    }).then(setAllStartYears);
  };

  const updateSelectedStartYear = (startYear: StartYearDTO) => {
    setSelectedStartYear(startYear);
    setAllCourses(null);
    setAddedSemesters([]);
    setCurrentPlan((oldPlan) => {
      return {
        ...oldPlan,
        startYear: startYear,
        specialization: "",
        semesters: [],
      };
    });
    ProxyBackendService.getCourses({
      startYearId: startYear?.id,
    }).then(setAllCourses);
  };

  const updateSelectedSpecialization = (specialization: string) => {
    setCurrentPlan((oldPlan) => {
      return {
        ...oldPlan,
        specialization: specialization == "None" ? "" : specialization,
      };
    });
  };

  React.useEffect(() => {
    if (allCourses && currentPlan) {
      setAddedSemesters(
        allCourses.data.semesters.filter((sem) =>
          currentPlan.semesters.find((curSem) => curSem.name === sem.name),
        ),
      );
    }
  }, [allCourses, currentPlan, id]);

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
      <TextField
        sx={{ width: "100%" }}
        id="outlined-basic"
        label="Title"
        variant="outlined"
        value={planTitle}
        onChange={(e) => setPlanTitle(e.target.value)}
      />

      <ProgramAndStartYearSelection
        allPrograms={allPrograms}
        setSelectedProgram={updateSelectedProgram}
        selectedProgram={selectedProgram}
        allStartYears={allStartYears}
        setSelectedStartYear={updateSelectedStartYear}
        selectedStartYear={selectedStartYear}
      />
      {selectedStartYear &&
        selectedStartYear.id != -1 &&
        (allCourses ? (
          <>
            <SpecializationSelection
              allCourses={allCourses}
              selectedSpecialization={selectedSpecialization}
              setSelectedSpecialization={updateSelectedSpecialization}
            />
            <Semesters
              allSemesters={allCourses?.data?.semesters}
              addedSemesters={addedSemesters}
              setAddedSemesters={setAddedSemesters}
              addOrUpdateSemesterPlan={addOrUpdateSemesterPlan}
              currentPlan={currentPlan}
            />
          </>
        ) : (
          <CircularProgress />
        ))}
      <SaveButton id={id} planTitle={planTitle} currentPlan={currentPlan} />
      <DeleteButton id={id} />
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

function SaveButton({
  id,
  planTitle,
  currentPlan,
}: {
  id: string | null | undefined;
  planTitle: string;
  currentPlan: MasterPlan;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const [buttonText, setButtonText] = React.useState("Save");
  const [successState, setSuccessState] = React.useState<
    "success" | "error" | "info" | "warning" | undefined
  >("info");

  const waitAndReset = (time: number = 3000) => {
    setTimeout(() => {
      setButtonText("Save");
      setSuccessState("info");
    }, time);
  };

  return (
    <Fab
      sx={{ position: "fixed", bottom: 80, right: 24 }}
      variant="extended"
      color={successState}
      onClick={() => {
        setButtonText("Saving...");
        if (id) {
          ProxyBackendService.updateMasterPlan({
            id: Number(id),
            requestBody: { title: planTitle, plan: currentPlan },
          })
            .then(() => {
              setButtonText("Saved changes successfully");
              setSuccessState("success");
              waitAndReset();
            })
            .catch(() => {
              setButtonText("Failed to save");
              setSuccessState("error");
              waitAndReset();
            });
        } else {
          ProxyBackendService.createMasterPlan({
            requestBody: { title: planTitle, plan: currentPlan },
          }).then((response) => {
            router.push(
              pathname + "?" + createQueryString("id", response.id.toString()),
            );
            setButtonText("Saved to new plan successfully");
            setSuccessState("success");
            waitAndReset();
          });
        }
      }}
    >
      <SaveIcon />
      {buttonText}
    </Fab>
  );
}

function DeleteButton({ id }: { id: string | null | undefined }) {
  const router = useRouter();

  const confirmMessage = "Are you sure?";

  const [buttonText, setButtonText] = React.useState("Delete");
  const [successState, setSuccessState] = React.useState<
    "success" | "error" | "info" | "warning" | undefined
  >("error");

  const waitAndReset = (time: number = 3000) => {
    setTimeout(() => {
      setButtonText("Delete");
      setSuccessState("error");
    }, time);
  };
  if (!id) {
    return <></>;
  }

  return (
    <Fab
      sx={{ position: "fixed", bottom: 20, right: 24 }}
      variant="extended"
      color={successState}
      onClick={() => {
        if (buttonText === "Delete") {
          setButtonText(confirmMessage);
        } else if (buttonText === confirmMessage) {
          setButtonText("Deleting...");
          ProxyBackendService.deleteMasterPlanById({
            id: Number(id),
          })
            .then(() => {
              setButtonText("Plan deleted successfully");
              setSuccessState("success");
              waitAndReset();
              localStorage.removeItem("savedPlan");
              router.push("/master");
            })
            .catch(() => {
              setButtonText("Failed to delete");
              setSuccessState("error");
              waitAndReset();
            });
        }
      }}
    >
      <DeleteIcon />
      {buttonText}
    </Fab>
  );
}

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
  const [blockFilter, setBlockFilter] = React.useState<string | undefined>();
  const [periodFilter, setPeriodFilter] = React.useState<string | undefined>();
  const handleOpen = (
    blockFilter: string | undefined = undefined,
    periodFilter: string | undefined = undefined,
  ) => {
    setBlockFilter(blockFilter);
    setPeriodFilter(periodFilter);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setBlockFilter(undefined);
    setPeriodFilter(undefined);
    setIsModalOpen(false);
  };

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

  React.useEffect(() => {
    const savedSemester = currentPlan.semesters.find(
      (sem) => sem.name === currentSemester.name,
    );
    if (savedSemester) setSemesterPlan(savedSemester);
  }, [currentPlan, currentSemester]);

  const updateSemesterPlan = (semesterPlan: SemesterPlan) => {
    setSemesterPlan(semesterPlan);
    addOrUpdateSemesterPlan(semesterPlan);
  };

  const addCourse = (
    course: Course,
    semester: Semester,
    allSemesters: Semester[],
  ) => {
    if (!semesterPlan) {
      return;
    }
    const semesterPlanCopy = structuredClone(semesterPlan);
    // Create list of all specializations that have the course
    const plannedSpecializations: PlannedCourseSpecialization[] = [];
    const coursePeriods: Period[] = [];
    for (const sem of allSemesters) {
      for (const spec of sem.specializations) {
        for (const per of spec.periods) {
          for (const cor of per.courses) {
            if (cor.courseCode === course.courseCode) {
              if (!plannedSpecializations.find((s) => s.name === spec.name)) {
                plannedSpecializations.push({
                  name: spec.name,
                  ECV: cor.ECV,
                });
              }
              if (!coursePeriods.find((p) => p.name === per.name)) {
                coursePeriods.push(per);
              }
            }
          }
        }
      }
    }
    for (const coursePeriod of coursePeriods) {
      const existingPeriodPlan = semesterPlanCopy.periods.find(
        (p) => p.name === coursePeriod.name,
      );
      const courseInPeriod = coursePeriod.courses.find(
        (c) => c.courseCode === course.courseCode,
      );
      if (!courseInPeriod) {
        continue;
      }
      // Only add the course if it is not already added
      if (
        !existingPeriodPlan?.courses.find(
          (c) => c.courseName === course.courseName,
        )
      ) {
        existingPeriodPlan?.courses.push({
          ...courseInPeriod,
          semester:
            currentSemester.name === semester.name ? null : semester.name,
          note: "",
          specializations: plannedSpecializations,
        });
      }
    }
    updateSemesterPlan(semesterPlanCopy);
  };

  const removeCourse = (course: Course) => {
    if (!semesterPlan) {
      return;
    }
    const semesterPlanCopy = structuredClone(semesterPlan);
    for (const periodPlan of semesterPlanCopy.periods) {
      periodPlan.courses = periodPlan.courses.filter(
        (plannedCourse) => plannedCourse.courseCode !== course.courseCode,
      );
    }
    updateSemesterPlan(semesterPlanCopy);
  };

  const getFilteredCourses = (courses: Course[]) => {
    return courses.filter((course) =>
      blockFilter ? course.timetableModule.includes(blockFilter) : true,
    );
  };

  return (
    <Box>
      <h4>Selected Courses</h4>
      {semesterPlan && (
        <>
          <Card sx={{ width: "100%" }}>
            <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <CourseSelectionSummary
                semesterPlan={semesterPlan}
                selectedSpecialization={currentPlan.specialization}
              />
            </CardContent>
          </Card>
          <SemesterPlanOverview
            plan={semesterPlan}
            selectedSpecialization={currentPlan.specialization}
            onAddCourse={(block, period) => handleOpen(block, period)}
            onClickCourse={(course) => console.log(course)}
          />
        </>
      )}
      <Button variant="contained" color="success" onClick={() => handleOpen()}>
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
                              {specialization.periods
                                .filter((period) =>
                                  periodFilter
                                    ? period.name === periodFilter
                                    : true,
                                )
                                .map((period, perIndex) => (
                                  <li
                                    key={`period-${specialization.name}-${perIndex}`}
                                  >
                                    <ul>
                                      <ListSubheader
                                        disableSticky
                                      >{`${period.name}`}</ListSubheader>
                                      <CourseSelectionGrid
                                        courses={getFilteredCourses(
                                          period.courses,
                                        )}
                                        addedCourses={
                                          semesterPlan?.periods.find(
                                            (p) => p.name === period.name,
                                          )?.courses
                                        }
                                        onCourseAdd={(course) =>
                                          addCourse(
                                            course,
                                            semester,
                                            allSemesters,
                                          )
                                        }
                                        onCourseRemove={removeCourse}
                                      />
                                    </ul>
                                  </li>
                                ))}
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
      <Card sx={{ width: "100%" }}>
        <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <CourseSelectionSummary
            semesterPlans={currentPlan.semesters}
            selectedSpecialization={currentPlan.specialization}
          />
        </CardContent>
      </Card>
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
  allStartYears,
  setSelectedStartYear,
  selectedStartYear,
}: {
  allPrograms: ProgramsResponseDTO | null;
  setSelectedProgram: (program: MasterProgramDTO) => void;
  selectedProgram: MasterProgramDTO | null;
  allStartYears: StartYearResponseDTO | null;
  setSelectedStartYear: (startYear: StartYearDTO) => void;
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
          onChange={(_, option) => setSelectedProgram(option!)}
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
            onChange={(_, option) => setSelectedStartYear(option!)}
            getOptionLabel={(opt) => opt.name}
          />
        ) : (
          <CircularProgress />
        ))}
    </>
  );
}

function SpecializationSelection({
  allCourses,
  selectedSpecialization,
  setSelectedSpecialization,
}: {
  allCourses: CoursesResponseDTO;
  selectedSpecialization: string;
  setSelectedSpecialization: (specialization: string) => void;
}) {
  const allSpecializations = Array.from(
    new Set(
      allCourses.data.semesters
        .map((semester) =>
          semester.specializations.map((specialization) => specialization.name),
        )
        .flat(),
    ),
  ).sort((a, b) => a.localeCompare(b));
  return (
    <>
      {allCourses && (
        <Autocomplete
          disablePortal
          id="specialization-selection"
          options={["None", ...allSpecializations]}
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
