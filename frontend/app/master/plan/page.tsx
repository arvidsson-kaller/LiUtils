import MasterPlanEditPage from "@/components/master/plan/MasterPlanEditPage";
import { BackendService } from "@/lib/backend";

export default async function MasterPlanPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const allPrograms = await BackendService.getAllPrograms();
  const id = searchParams?.id || null;
  let loadedPlan = null;
  let loadedStartYears = null;
  let loadedAllCourses = null;
  if (id) {
    loadedPlan = await BackendService.getMasterPlanById({ id: Number(id) });
    if (loadedPlan) {
      loadedStartYears = await BackendService.getStartYears({
        programId: loadedPlan.plan.program.id,
      });
      loadedAllCourses = await BackendService.getCourses({
        startYearId: loadedPlan.plan.startYear.id,
      });
    }
  }
  return (
    <MasterPlanEditPage
      allPrograms={allPrograms}
      id={id}
      loadedPlan={loadedPlan}
      loadedStartYears={loadedStartYears}
      loadedAllCourses={loadedAllCourses}
    />
  );
}
