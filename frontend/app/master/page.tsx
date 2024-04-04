"use client";
import { Program, Semester, StartYear } from "@/common/dist/studieinfo";
import { getStudieInfo } from "@/lib/studieinfo";
import {
  Autocomplete,
  Container,
  List,
  ListSubheader,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import React from "react";

const columns: GridColDef[] = [
  { field: "courseCode", headerName: "Course", width: 100 },
  {
    field: "courseName",
    headerName: "Name",
    width: 300,
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
  { field: "credits", headerName: "Credits", width: 130 },
  { field: "level", headerName: "Level", width: 90 },
  { field: "timetableModule", headerName: "Block", width: 90 },
  { field: "ECV", headerName: "ECV", width: 90 },
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
                      rows={
                        allSpecializations[specIndex].periods[perIndex].courses
                      }
                      columns={columns}
                      checkboxSelection
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
