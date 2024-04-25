"use client";
import { SemesterPlanOverview } from "@/components/master/SemesterPlanOverview";
import { SemesterPlan } from "@/lib/backend-client";
import { Container } from "@mui/material";
import React from "react";

export default function SemesterPlanTest() {
  const plan1: SemesterPlan = {
    name: "Autumn 9",
    periods: [
      {
        name: "Period 1",
        courses: [
          {
            ECV: "E",
            info: "",
            level: "A1X",
            credits: "6",
            courseCode: "TANA15",
            courseName: "Numerical Linear Algebra",
            timetableModule: "1",
            note: "",
            semester: null,
            specializations: [],
          },
          {
            ECV: "E",
            info: "*The course is divided into several semesters and/or periods",
            level: "A1X",
            credits: "6*",
            courseCode: "TDDD38",
            courseName: "Advanced Programming in C++",
            timetableModule: "2",
            note: "",
            semester: null,
            specializations: [],
          },
        ],
      },
      {
        name: "Period 2",
        courses: [
          {
            ECV: "E",
            info: "*The course is divided into several semesters and/or periods",
            level: "A1X",
            credits: "6*",
            courseCode: "TDDD38",
            courseName: "Advanced Programming in C++",
            timetableModule: "2,1",
            note: "",
            semester: null,
            specializations: [
              {
                name: "Specialisation: Computer Systems Architecture",
                ECV: "C",
              },
            ],
          },
          {
            ECV: "E",
            info: "",
            level: "A1X",
            credits: "6",
            courseCode: "TANA15",
            courseName: "Numerical Linear Algebra",
            timetableModule: "1",
            note: "",
            semester: null,
            specializations: [
              {
                name: "Courses",
                ECV: "C",
              },
            ],
          },
          {
            ECV: "E",
            info: "",
            level: "A1X",
            credits: "6",
            courseCode: "TSBK07",
            courseName: "Datorgrafik",
            timetableModule: "3",
            note: "",
            semester: null,
            specializations: [],
          },
          {
            ECV: "E",
            info: "",
            level: "A1X",
            credits: "6",
            courseCode: "TDDE65",
            courseName: "Super computers",
            timetableModule: "4",
            note: "",
            semester: null,
            specializations: [],
          },
        ],
      },
    ],
  };

  const plan2: SemesterPlan = {
    name: "my plan",
    periods: [
      {
        courses: [],
        name: "Period 0",
      },
      {
        courses: [],
        name: "Period 1",
      },
    ],
  };

  return (
    <Container sx={{ p: 4, width: 800 }}>
      <SemesterPlanOverview
        plan={plan1}
        selectedSpecialization="Specialisation: Computer Systems Architecture"
        onAddCourse={(block, period) => {
          console.log({ block, period });
        }}
        onClickCourse={(course) => {
          console.log({ course });
        }}
      />
    </Container>
  );
}
