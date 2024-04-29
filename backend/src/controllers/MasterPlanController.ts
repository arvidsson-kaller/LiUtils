import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  Request,
  Security,
  Put,
  Path,
} from "tsoa";
import { MasterPlan } from "common/dist/masterPlan";
import MasterPlanRepo, {
  DbMasterPlanWithUser,
} from "@src/repos/MasterPlanRepo";
import { UserDTO, mapUserToDTO } from "./UserController";
import { AuthenticatedRequest } from "@src/authentication";
import { MasterPlanId } from "@src/models/MasterPlan";

@Route("plan")
export class MasterPlanController extends Controller {
  @Get()
  public async getAllMasterPlans(): Promise<MasterPlanResponseDTO[]> {
    const plans = await MasterPlanRepo.getAll();
    return plans.map(mapPlanToDTO);
  }

  @Security("jwt")
  @Get("/user")
  public async getAllMasterPlanForUser(
    @Request() request: AuthenticatedRequest,
  ): Promise<MasterPlanResponseDTO[]> {
    const plans = await MasterPlanRepo.getAllByUserId(request.user.id);
    return plans.map(mapPlanToDTO);
  }

  @Security("jwt")
  @Post()
  public createMasterPlan(
    @Request() request: AuthenticatedRequest,
    @Body() body: CreateMasterPlanRequestDTO,
  ) {
    MasterPlanRepo.create({
      title: body.title,
      data: body.plan,
      userId: request.user.id,
    });
  }

  @Security("jwt")
  @Put("{id}")
  public updateMasterPlan(
    @Request() request: AuthenticatedRequest,
    @Body() body: UpdateMasterPlanRequestDTO,
    @Path() id: number,
  ) {
    MasterPlanRepo.update({
      id: id as MasterPlanId,
      title: body.title,
      data: body.plan,
      userId: request.user.id,
    });
  }
}

interface MasterPlanResponseDTO {
  id: number;
  title: string;
  plan: MasterPlan;
  user: UserDTO;
}

export const mapPlanToDTO = (
  plan: DbMasterPlanWithUser,
): MasterPlanResponseDTO => {
  return {
    id: plan.id,
    title: plan.title,
    plan: plan.data as MasterPlan,
    user: mapUserToDTO(plan.user),
  };
};

interface CreateMasterPlanRequestDTO {
  /**
   * @minLength 8
   */
  title: string;
  plan: MasterPlan;
}

interface UpdateMasterPlanRequestDTO {
  /**
   * @minLength 8
   */
  title: string;
  plan: MasterPlan;
}
