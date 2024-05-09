import { MasterPlanResponseDTO } from "@/lib/backend-client";
import { specLabel, stringToColor } from "@/lib/master/helpers";
import { getNumericCourseCredit } from "@/lib/utils";
import { PieChart } from "@mui/x-charts";
import React from "react";

export default function SpecializationOverview({
  masterplan,
  size = 300,
}: {
  masterplan: MasterPlanResponseDTO;
  size?: number;
}) {
  const plan = masterplan.plan;
  const creditsPerSpecialization = React.useMemo(() => {
    const creditsPerSpecialization: any = {};
    const uniqueCourses = new Set();
    plan.semesters.forEach((s) =>
      s.periods.forEach((p) =>
        p.courses.forEach((c) => {
          if (!uniqueCourses.has(c.courseName)) {
            uniqueCourses.add(c.courseName);
            c.specializations
              .filter(
                (s) => s.name !== "Courses" && s.name !== "Preliminary courses",
              )
              .forEach((spec) => {
                if (!creditsPerSpecialization[spec.name]) {
                  creditsPerSpecialization[spec.name] = 0;
                }
                creditsPerSpecialization[spec.name] +=
                  getNumericCourseCredit(c);
              });
          }
        }),
      ),
    );
    const data = Object.entries(creditsPerSpecialization).map(
      ([spec, credits], i) => ({
        id: i,
        value: Number(credits),
        label: specLabel(spec),
        color: stringToColor(specLabel(spec)),
      }),
    );
    return data
      .filter((d) => d.value >= 3 * 6)
      .sort((a, b) => b.value - a.value);
  }, [plan]);

  const radius = size / 2;

  return (
    <PieChart
      series={[
        {
          data: creditsPerSpecialization,
          highlightScope: { faded: "global", highlighted: "item" },
          cx: radius,
          innerRadius: radius / 2,
          outerRadius: radius,
          paddingAngle: 2,
        },
      ]}
      slotProps={{
        legend: {
          direction: "row",
          position: { vertical: "middle", horizontal: "left" },
          padding: size + size / 10,
        },
      }}
      height={size}
    />
  );
}
