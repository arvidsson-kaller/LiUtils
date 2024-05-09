import { PlannedCourse, SemesterPlan } from "@/lib/backend-client";
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
}: {
  plan: SemesterPlan;
  selectedSpecialization: string;
  onAddCourse?: onAddCourseCallback;
  onClickCourse?: onClickCourseCallback;
}) => {
  return (
    <List>
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
                // border: "1px solid black",
                justifyContent: "space-evenly",
              }}
            >
              <Typography>Block {block}</Typography>
              {plan.periods
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

function Block({
  courses,
  selectedSpecialization,
  block,
  period,
  onAddCourse,
  onClickCourse,
}: {
  courses: PlannedCourse[];
  selectedSpecialization: string;
  block: string;
  period: string;
  onAddCourse?: onAddCourseCallback;
  onClickCourse?: onClickCourseCallback;
}) {
  const coursesInBlock = courses.filter((c) =>
    c.timetableModule.includes(block),
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
        <Card
          key={course.courseCode}
          sx={{
            background: stringToColor(course.courseName),
            color: getTextColorFromBackground(stringToColor(course.courseName)),
            flex: "auto",
            my: 0.5,
            minHeight: 75 / 2,
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
          onClick={() => onClickCourse && onClickCourse(course)}
        >
          <CourseContent
            course={course}
            selectedSpecialization={selectedSpecialization}
          />
        </Card>
      ))}
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
    </Box>
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
