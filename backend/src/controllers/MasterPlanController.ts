import { Body, Controller, Get, Post, Route } from "tsoa";
import { MasterPlan } from "common/dist/masterPlan";

@Route("plan")
export class MasterPlanController extends Controller {
    @Get()
    public getMasterPlan(): MasterPlanResponseDTO {
        return {
            plan: {
                note: "",
                programName: "",
                semesters: [],
                specializion: "",
                startYear: ""
            }
        }
    }

    @Post()
    public createMasterPlan(
        @Body() request: CreateMasterPlanRequestDTO,
    ) {

    }
}

interface MasterPlanResponseDTO {
    plan: MasterPlan;
}

interface CreateMasterPlanRequestDTO {
    plan: MasterPlan
}
