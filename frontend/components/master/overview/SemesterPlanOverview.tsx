import {
  Course,
  PeriodPlan,
  PlannedCourse,
  SemesterPlan,
} from "@/lib/backend-client";
import {
  Box,
  Button,
  Card,
  Divider,
  Link,
  List,
  ListItem,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import NextLink from "../../NextLink";
import { ecvLabel, specLabel, stringToColor } from "@/lib/master/helpers";
import React from "react";
import { keyframes } from "@mui/system";

export interface onAddCourseCallback {
  (block: string, period: string): any;
}

export interface onClickCourseCallback {
  (course: PlannedCourse): any;
}

export const SemesterPlanOverview = ({
  plan,
  selectedSpecialization,
  onAddCourse,
  onClickCourse,
  readOnly = false,
  highlightCourse = "",
}: {
  plan: SemesterPlan;
  selectedSpecialization: string;
  onAddCourse?: onAddCourseCallback;
  onClickCourse?: onClickCourseCallback;
  readOnly?: boolean;
  highlightCourse?: string;
}) => {
  const periods: PeriodPlan[] =
    plan.periods.length !== 0
      ? plan.periods
      : [
          {
            name: "Period 1",
            courses: [],
          },
          {
            name: "Period 2",
            courses: [],
          },
        ];

  return (
    <List
      sx={{
        py: 0,
      }}
    >
      <ListItem
        sx={{
          width: "100%",
          display: "flex",
          m: 0,
          py: 0,
        }}
      >
        <Box
          sx={{
            m: 0,
            display: "flex",
            flex: "1",
            justifyContent: "space-evenly",
            marginLeft: "7ex",
          }}
        >
          {periods
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((period) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  px: 1,
                  flex: 1,
                }}
                key={period.name}
              >
                {period.name}
              </Box>
            ))}
        </Box>
      </ListItem>
      <Divider component="li" />
      {["1", "2", "3", "4"].map((block) => (
        <Box key={"block" + block}>
          <ListItem
            sx={{
              width: "100%",
              display: "flex",
              m: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flex: "1",
                justifyContent: "space-evenly",
              }}
            >
              <Typography>Block {block}</Typography>
              {periods
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((period) => (
                  <Block
                    key={period.name + block}
                    selectedSpecialization={selectedSpecialization}
                    courses={period.courses}
                    block={block}
                    period={period.name}
                    onAddCourse={onAddCourse}
                    onClickCourse={onClickCourse}
                    readOnly={readOnly}
                    highlightCourse={highlightCourse}
                  />
                ))}
            </Box>
          </ListItem>
          <Divider component="li" />
        </Box>
      ))}
    </List>
  );
};

function getTextColorFromBackground(color: string): string {
  const rgb = color.match(/\d+/g)!.map(Number);
  const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  return brightness > 128 ? "black" : "white";
}

const borderAnimation = keyframes`
  from {
    background-position: 0 0, -34.64px 0, 100% -34.64px, 0 100%;
  }
  to {
    background-position: 0 -34.64px, 0 0, 100% 0, -34.64px 100%;
  }
`;

function Block({
  courses,
  selectedSpecialization,
  block,
  period,
  onAddCourse,
  onClickCourse,
  readOnly,
  highlightCourse,
}: {
  courses: PlannedCourse[];
  selectedSpecialization: string;
  block: string;
  period: string;
  onAddCourse?: onAddCourseCallback;
  onClickCourse?: onClickCourseCallback;
  readOnly: boolean;
  highlightCourse: string;
}) {
  const coursesInBlock = courses.filter(
    (c) => c.timetableModule.includes(block) || c.timetableModule.includes("-"),
  );
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        px: 1,
        flex: 1,
        minHeight: 75,
      }}
    >
      {coursesInBlock.map((course) => (
        <CoursePreview
          key={course.courseCode}
          course={course}
          readOnly={readOnly}
          highlightCourse={highlightCourse}
          selectedSpecialization={selectedSpecialization}
          onClickCourse={onClickCourse}
        ></CoursePreview>
      ))}
      {!readOnly && (
        <Box
          //
          sx={{
            position: "relative",
            flex: coursesInBlock.length === 0 ? "auto" : "none",
            height: "2px",
            p: 0,
            m: 0,
            pb: 1,
            opacity: 0,
            transition: "opacity 0.3s ease-in-out, height 0.3s ease-in-out",
            "&:hover": {
              opacity: 1,
              height: 75 / 2,
            },
          }}
        >
          <Button
            onClick={() => onAddCourse && onAddCourse(block, period)}
            variant="contained"
            sx={{
              width: "100%",
              height: "100%",
              fontSize: "24px",
              color: "white",
            }}
          >
            +
          </Button>
        </Box>
      )}
    </Box>
  );
}

function CoursePreview({
  course,
  selectedSpecialization,
  onClickCourse,
  readOnly,
  highlightCourse,
}: {
  course: PlannedCourse;
  selectedSpecialization: string;
  onClickCourse?: onClickCourseCallback;
  readOnly: boolean;
  highlightCourse: string;
}) {
  const color = stringToColor(course.courseName);
  const textColor = getTextColorFromBackground(color);
  const isHighlighted = course.courseCode === highlightCourse;

  return (
    <Card
      sx={{
        background: color,
        color: textColor,
        flex: "auto",
        my: 0.5,
        minHeight: 75 / 2,
        p: 1,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        cursor: readOnly ? "" : "pointer",
        "&:hover": {
          opacity: readOnly ? 1 : 0.7,
        },
        backgroundImage: isHighlighted
          ? `repeating-linear-gradient(0, ${textColor}, ${textColor} 17px, transparent 17px, transparent 34px, ${textColor} 34px), repeating-linear-gradient(79deg, ${textColor}, ${textColor} 17px, transparent 17px, transparent 34px, ${textColor} 34px), repeating-linear-gradient(169deg, ${textColor}, ${textColor} 17px, transparent 17px, transparent 34px, ${textColor} 34px), repeating-linear-gradient(259deg, ${textColor}, ${textColor} 17px, transparent 17px, transparent 34px, ${textColor} 34px)`
          : "",
        backgroundSize: isHighlighted
          ? "3px calc(100% + 34.64px), calc(100% + 34.64px) 3px, 3px calc(100% + 34.64px) , calc(100% + 34.64px) 3px"
          : "",
        backgroundPosition: isHighlighted ? "0 0, 0 0, 100% 0, 0 100%" : "",
        backgroundRepeat: isHighlighted ? "no-repeat" : "",
        animation: isHighlighted
          ? `${borderAnimation} 0.7s infinite linear`
          : "",
      }}
      onClick={() => onClickCourse && onClickCourse(course)}
    >
      <CourseContent
        course={course}
        selectedSpecialization={selectedSpecialization}
      />
    </Card>
  );
}

function CourseContent({
  course,
  selectedSpecialization,
}: {
  course: PlannedCourse;
  selectedSpecialization: string;
}) {
  const spec = course.specializations.find(
    (sp) => sp.name === selectedSpecialization,
  );

  const all = course.specializations.find((sp) => sp.name === "Courses");

  return (
    <>
      <Typography>
        <NextLink
          href={"https://studieinfo.liu.se/en/kurs/" + course.courseCode}
          target="_blank"
          referrerPolicy="no-referrer"
        >
          <span style={{ textDecoration: "underline" }} color={"inherit"}>
            {course.courseCode}
          </span>
        </NextLink>
        : {course.courseName}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Tooltip
          arrow
          title={
            spec &&
            `
                            This course is part of specialisation ${specLabel(spec.name)} and is ${ecvLabel(spec.ECV)}. 
                        `
          }
        >
          <Typography
            sx={{
              fontSize: 12,
            }}
          >
            {spec && specLabel(spec.name) + ` (${spec.ECV})`}
          </Typography>
        </Tooltip>

        <Tooltip
          arrow
          title={`
                            This course is ${course.credits} credits of level ${course.level}. 
                            ${all && `It is ${ecvLabel(all.ECV)} for your program.`}
                            ${course.info}
                        `}
        >
          <Typography
            sx={{
              fontSize: 12,
            }}
          >
            {course.credits} {course.level} {all && " " + all.ECV}
          </Typography>
        </Tooltip>
      </Box>
    </>
  );
}
