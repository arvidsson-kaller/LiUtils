import AssessmentIcon from "@mui/icons-material/Assessment";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import InfoIcon from "@mui/icons-material/Info";
import Link from "next/link";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Button, Popper } from "@mui/material";
import React from "react";
import { Course } from "@/lib/backend-client";

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
        sx={{ zIndex: 10000 }}
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

export const CourseSelectionGrid = ({
  courses,
  onCourseAdd,
}: {
  courses: Course[];
  onCourseAdd: (course: Course) => void;
}) => {
  const columns: GridColDef[] = [
    {
      field: "add",
      headerName: "Add",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, Date>) => (
        <Button
          variant="contained"
          color="success"
          onClick={() => onCourseAdd(params.row)}
        >
          Add
        </Button>
      ),
    },
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
  ];
  return (
    <DataGrid
      getRowId={(row) => row.courseCode}
      rows={courses}
      columns={columns}
      hideFooterPagination
      disableRowSelectionOnClick
    />
  );
};
