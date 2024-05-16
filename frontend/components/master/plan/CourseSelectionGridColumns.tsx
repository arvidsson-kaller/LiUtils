import {
  Course,
  PlannedCourse,
  Semester,
  SemesterPlan,
} from "@/lib/backend-client";
import {
  addCourseToSemesterPlan,
  removeCourseFromSemesterPlan,
} from "@/lib/utils";
import { Box, Button, Popper } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import React from "react";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import InfoIcon from "@mui/icons-material/Info";

const InfoPopper = ({ info }: { info: string }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const infoRef = React.useRef(null);

  return info ? (
    <>
      <Button
        ref={infoRef}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(!open)}
      >
        <InfoIcon />
      </Button>
      <Popper
        sx={{ zIndex: 2000 }}
        open={open}
        anchorEl={infoRef.current}
        placement="right"
      >
        <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>{info}</Box>
      </Popper>
    </>
  ) : (
    <></>
  );
};

export interface SemesterPlanWithHighlight {
  plan: SemesterPlan;
  highlight: string;
}

export const getColumns = (
  addedCourses: PlannedCourse[] | undefined,
  semesterPlan: SemesterPlan | undefined,
  currentSemester: Semester,
  allSemesters: Semester[],
  semester: Semester,
  onCourseRemove: (course: Course) => void,
  onCourseAdd: (course: Course) => void,
  setAnchorEl: (anchorEl: HTMLButtonElement | null) => void,
  setOpen: (open: boolean) => void,
  setPopperPlan: (popperPlan: SemesterPlanWithHighlight | undefined) => void,
) => {
  const showOverview = (
    anchorEl: HTMLButtonElement | null,
    popperPlan: SemesterPlanWithHighlight,
  ) => {
    setAnchorEl(anchorEl);
    setOpen(true);
    setPopperPlan(popperPlan);
  };
  return [
    { field: "courseCode", headerName: "Course", flex: 1 },
    {
      field: "courseName",
      headerName: "Name",
      flex: 5,
      renderCell: (params: GridRenderCellParams<any, Date>) => (
        <Link
          target="_blank"
          referrerPolicy="no-referrer"
          href={`https://studieinfo.liu.se/kurs/${params.row.courseCode}`}
        >
          {params.row.courseName}
        </Link>
      ),
    },
    { field: "credits", headerName: "Credits", flex: 1 },
    { field: "level", headerName: "Level", flex: 1 },
    {
      field: "timetableModule",
      headerName: "Block",
      flex: 1,
      description: "Timetable Module/Block",
    },
    {
      field: "ECV",
      headerName: "ECV",
      flex: 1,
      description: "Elective/Compulsory/Voluntary",
    },
    {
      field: "exam",
      headerName: "Exam",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, Date>) => (
        <Link
          style={{ display: "flex", alignItems: "center", height: "100%" }}
          target="_blank"
          referrerPolicy="no-referrer"
          href={`https://ysektionen.se/student/tentastatistik/${params.row.courseCode}`}
        >
          <AssessmentIcon />
        </Link>
      ),
    },
    {
      field: "evaliuate",
      headerName: "Evaliuate",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, Date>) => (
        <Link
          style={{ display: "flex", alignItems: "center", height: "100%" }}
          target="_blank"
          referrerPolicy="no-referrer"
          href={`https://admin.evaliuate.liu.se/search/#${params.row.courseCode}`} // The course code has no effect on the link, it is just there to indicate which link was pressed
        >
          <HistoryEduIcon />
        </Link>
      ),
    },
    {
      field: "info",
      headerName: "Info",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, Date>) => (
        <InfoPopper info={params.row.info} />
      ),
    },
    {
      field: "add",
      headerName: "Add",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, Date>) =>
        addedCourses &&
        addedCourses.find(
          (course) => course.courseCode === params.row.courseCode,
        ) ? (
          <Button
            variant="contained"
            color="error"
            onClick={() => onCourseRemove(params.row)}
            onMouseOver={(e) => {
              if (semesterPlan) {
                const semesterPlanCopy = structuredClone(semesterPlan);
                removeCourseFromSemesterPlan(params.row, semesterPlanCopy);
                showOverview(e.currentTarget, {
                  plan: semesterPlanCopy,
                  highlight: "",
                });
              }
            }}
            onMouseLeave={() => setOpen(false)}
          >
            Del
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={() => onCourseAdd(params.row)}
            onMouseOver={(e) => {
              if (semesterPlan) {
                const semesterPlanCopy = structuredClone(semesterPlan);
                addCourseToSemesterPlan(
                  params.row,
                  semesterPlanCopy,
                  semester,
                  allSemesters,
                  currentSemester,
                );
                showOverview(e.currentTarget, {
                  plan: semesterPlanCopy,
                  highlight: params.row.courseCode,
                });
              }
            }}
            onMouseLeave={() => setOpen(false)}
          >
            Add
          </Button>
        ),
    },
  ];
};
