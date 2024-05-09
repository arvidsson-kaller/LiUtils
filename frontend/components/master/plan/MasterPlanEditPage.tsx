"use client";
import { ProxyBackendService } from "@/lib/backend";
import {
  CoursesResponseDTO,
  MasterPlan,
  MasterPlanResponseDTO,
  MasterProgramDTO,
  ProgramsResponseDTO,
  Semester,
  SemesterPlan,
  StartYearDTO,
  StartYearResponseDTO,
} from "@/lib/backend-client";
import { CircularProgress, Container, TextField } from "@mui/material";

import React from "react";
import { SaveButton } from "./SaveButton";
import { DeleteButton } from "./DeleteButton";
import { Semesters } from "./Semesters";
import { ProgramAndStartYearSelection } from "./ProgramAndStartYearSelection";
import { SpecializationSelection } from "./SpecializationSelection";

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

  React.useEffect(() => {
    if (allCourses && currentPlan) {
      setAddedSemesters(
        allCourses.data.semesters.filter((sem) =>
          currentPlan.semesters.find((curSem) => curSem.name === sem.name),
        ),
      );
    }
  }, [allCourses, currentPlan, id]);

  const updateSelectedProgram = React.useCallback(
    (program: MasterProgramDTO) => {
      setSelectedProgram(program);
      setAllStartYears(null);
      setAllCourses(null);
      setSelectedStartYear(null);
      setSelectedSpecialization("");
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
    },
    [],
  );

  const updateSelectedStartYear = React.useCallback(
    (startYear: StartYearDTO) => {
      setSelectedStartYear(startYear);
      setAllCourses(null);
      setSelectedSpecialization("");
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
    },
    [],
  );

  const updateSelectedSpecialization = React.useCallback(
    (specialization: string) => {
      setSelectedSpecialization(specialization);
      setCurrentPlan((oldPlan) => {
        return {
          ...oldPlan,
          specialization: specialization === "None" ? "" : specialization,
        };
      });
    },
    [],
  );

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
        error={planTitle.length < 8}
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
