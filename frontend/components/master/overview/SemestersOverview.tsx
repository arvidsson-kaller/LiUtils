import { MasterPlanResponseDTO, SemesterPlan } from "@/lib/backend-client";
import { getNumericCourseCredit } from "@/lib/utils";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import React from "react";

export default function SemestersOverview({
  masterplan,
  onSemesterClick,
}: {
  masterplan: MasterPlanResponseDTO;
  onSemesterClick?: (event: React.MouseEvent<any>, plan: SemesterPlan) => void;
}) {
  const plan = masterplan.plan;
  const creditsPerSemester = React.useMemo(() => {
    const creditsPerSemester: any = {};
    const uniqueCourses = new Set();
    plan.semesters.forEach((s) =>
      s.periods.forEach((p) =>
        p.courses.forEach((c) => {
          if (!uniqueCourses.has(c.courseName)) {
            uniqueCourses.add(c.courseName);
            if (!creditsPerSemester[s.name]) {
              creditsPerSemester[s.name] = 0;
            }
            creditsPerSemester[s.name] += getNumericCourseCredit(c);
          }
        }),
      ),
    );
    return Object.entries(creditsPerSemester);
  }, [plan]);

  return (
    <List>
      {creditsPerSemester.map(([semester, credits]) => (
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) =>
              onSemesterClick &&
              onSemesterClick(
                e,
                plan.semesters.find((s) => s.name == semester)!,
              )
            }
          >
            <ListItemText primary={semester} secondary={credits + " credits"} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
