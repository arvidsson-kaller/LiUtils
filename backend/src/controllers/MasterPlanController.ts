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
  Query,
  Delete,
} from "tsoa";
import { MasterPlan } from "common/dist/masterPlan";
import MasterPlanRepo, {
  DbMasterPlanWithUser,
} from "@src/repos/MasterPlanRepo";
import { UserDTO, mapUserToDTO } from "./UserController";
import { AuthenticatedRequest } from "@src/authentication";
import { MasterPlanId } from "@src/models/MasterPlan";
import { UserId } from "@src/models/User";

@Route("masterplan")
export class MasterPlanController extends Controller {
  @Get()
  public async getAllMasterPlans(
    @Query() program?: string,
    @Query() year?: string,
    @Query() specialization?: string,
  ): Promise<MasterPlanResponseDTO[]> {
    const plans = await MasterPlanRepo.getAll(program, year, specialization);
    return plans.map(mapPlanToDTO);
  }

  @Get("{id}")
  public async getMasterPlanById(
    @Path() id: number,
  ): Promise<MasterPlanResponseDTO> {
    const plan = await MasterPlanRepo.findById(id as MasterPlanId);
    return mapPlanToDTO(plan);
  }

  @Security("jwt")
  @Delete("{id}")
  public async deleteMasterPlanById(
    @Path() id: number,
    @Request() request: AuthenticatedRequest,
  ) {
    await MasterPlanRepo.deleteById(id as MasterPlanId, request.user.id);
  }

  @Security("jwt")
  @Get("user/me")
  public async getMyMasterPlans(
    @Request() request: AuthenticatedRequest,
  ): Promise<MasterPlanResponseDTO[]> {
    const plans = await MasterPlanRepo.getAllByUserId(request.user.id);
    return plans.map(mapPlanToDTO);
  }

  @Get("user/{id}")
  public async getMasterPlansByUserId(
    @Path() id: number,
  ): Promise<MasterPlanResponseDTO[]> {
    const plans = await MasterPlanRepo.getAllByUserId(id as UserId);
    return plans.map(mapPlanToDTO);
  }

  @Security("jwt")
  @Post()
  public async createMasterPlan(
    @Request() request: AuthenticatedRequest,
    @Body() body: CreateMasterPlanRequestDTO,
  ): Promise<MasterPlanCreatedResponseDTO> {
    const plan = await MasterPlanRepo.create({
      title: body.title,
      data: body.plan,
      userId: request.user.id,
    });
    const amountOfPlans = await MasterPlanRepo.countByUserId(request.user.id);
    if (amountOfPlans === 1) {
      MasterPlanRepo.setChoosenPlan(request.user.id, plan.id);
    }
    return {
      id: plan.id,
    };
  }

  @Security("jwt")
  @Put("{id}")
  public async updateMasterPlan(
    @Request() request: AuthenticatedRequest,
    @Body() body: UpdateMasterPlanRequestDTO,
    @Path() id: number,
  ) {
    await MasterPlanRepo.update({
      id: id as MasterPlanId,
      title: body.title,
      data: body.plan,
      userId: request.user.id,
    });
  }

  @Security("jwt")
  @Post("user/me/{id}")
  public async setChoosenMasterPlan(
    @Request() request: AuthenticatedRequest,
    @Path() id: number,
  ) {
    await MasterPlanRepo.setChoosenPlan(request.user.id, id as MasterPlanId);
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

interface MasterPlanCreatedResponseDTO {
  id: number;
}

interface UpdateMasterPlanRequestDTO {
  /**
   * @minLength 8
   */
  title: string;
  plan: MasterPlan;
}
