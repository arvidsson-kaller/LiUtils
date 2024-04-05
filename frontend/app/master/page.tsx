"use client";
import { Program, Semester, StartYear } from "@/common/dist/studieinfo";
import { getStudieInfo } from "@/lib/studieinfo";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  List,
  ListSubheader,
  Popper,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import InfoIcon from "@mui/icons-material/Info";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Link from "next/link";
import React from "react";
import { CourseSelectionSummary } from "@/components/master/CourseSelectionSummary";

const columns: GridColDef[] = [
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
    field: "info",
    headerName: "Info",
    flex: 1,
    renderCell: (params: GridRenderCellParams<any, Date>) => (
      <InfoPopper info={params.row.info} />
    ),
  },
];

export default function Master() {
  const studieInfo = getStudieInfo();
  const [selectedProgram, setSelectedProgram] = React.useState<Program>();
  const [selectedStartYear, setSelectedStartYear] = React.useState<StartYear>();
  const [selectedSemester, setSelectedSemester] = React.useState<Semester>();
  //   const [selectedSpecialization, setSelectedSpecialization] = React.useState<Specialization>();
  const allPrograms = studieInfo.programs;
  const allStartYears = selectedProgram?.startYears || [];
  const allSemesters = selectedStartYear?.semesters || [];
  const allSpecializations = selectedSemester?.specializations || [];

  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  return (
    <Container
      sx={{
        display: "flex",
        bgcolor: "background.paper",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <h1>Master Planning</h1>
      <Autocomplete
        disablePortal
        id="master-selection"
        options={allPrograms}
        sx={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} label="Program" />}
        onChange={(_, option) => setSelectedProgram(option!)}
        getOptionLabel={(opt) => opt.name}
      />
      <Autocomplete
        key={selectedProgram?.name || "StartYear"}
        disablePortal
        disabled={selectedProgram === undefined}
        id="start-year-selection"
        options={allStartYears}
        sx={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} label="Start Year" />}
        onChange={(_, option) => setSelectedStartYear(option!)}
        getOptionLabel={(opt) => opt.name}
      />
      <Autocomplete
        key={selectedStartYear?.name || "Semester"}
        disablePortal
        disabled={selectedStartYear === undefined}
        id="start-year-selection"
        options={allSemesters}
        sx={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} label="Semester" />}
        onChange={(_, option) => setSelectedSemester(option!)}
        getOptionLabel={(opt) => opt.name}
      />
      <Card sx={{ width: "100%", position: "sticky", top: 0, zIndex: 10 }}>
        <CardContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <CourseSelectionSummary
            courseCodes={rowSelectionModel as string[]}
            semester={selectedSemester!}
          />
        </CardContent>
      </Card>
      <Button
        variant="contained"
        color="error"
        onClick={() => setRowSelectionModel([])}
      >
        Clear Selections
      </Button>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          position: "relative",
          overflow: "auto",
          maxHeight: "100%",
          "& ul": { padding: 0 },
        }}
        subheader={<li />}
      >
        {allSpecializations.map((specialization, specIndex) => (
          <li key={`specialization-${specialization.name}-${specIndex}`}>
            <ul>
              <ListSubheader>{`${specialization.name}`}</ListSubheader>
              {allSpecializations[specIndex].periods.map((period, perIndex) => (
                <li key={`period-${specialization.name}-${perIndex}`}>
                  <ul>
                    <ListSubheader>{`${period.name}`}</ListSubheader>
                    <DataGrid
                      getRowId={(row) => row.courseCode}
                      rows={allSpecializations[specIndex].periods[
                        perIndex
                      ].courses.map((course) => {
                        return { ...course, period: period };
                      })}
                      columns={columns}
                      checkboxSelection
                      hideFooterPagination
                      disableRowSelectionOnClick
                      onCellClick={(params) => {
                        if (params.field === "__check__") {
                          if (params.formattedValue === "yes") {
                            // Remove the course
                            setRowSelectionModel(
                              rowSelectionModel.filter((id) => id !== params.id)
                            );
                          } else {
                            // Add the course
                            setRowSelectionModel([
                              ...rowSelectionModel,
                              params.id,
                            ]);
                          }
                        }
                      }}
                      rowSelectionModel={rowSelectionModel}
                    />
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </List>
    </Container>
  );
}

const InfoPopper = ({ info }: { info: string }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const infoRef = React.useRef(null);

  return info ? (
    <>
      <Button ref={infoRef} onClick={() => setOpen(!open)}>
        <InfoIcon />
      </Button>
      <Popper open={open} anchorEl={infoRef.current} placement="right">
        <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>{info}</Box>
      </Popper>
    </>
  ) : (
    <></>
  );
};
