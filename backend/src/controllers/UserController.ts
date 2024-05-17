import { Body, Controller, Get, Post, Route, Security, Request } from "tsoa";
import DbUser, { DbUserInitializer } from "@src/models/User";
import { AuthenticatedRequest } from "@src/authentication";
import JwtService from "@src/services/JwtService";
import UserRepo from "@src/repos/UserRepo";

@Route("users")
export class UserController extends Controller {
  @Get()
  public async getUsers(): Promise<UsersResponseDTO> {
    const users = await UserRepo.getAll();
    const UserDTOs = users.map(mapUserToDTO);
    return {
      users: UserDTOs,
    };
  }

  @Security("jwt")
  @Get("/me")
  public async getMyUser(
    @Request() request: AuthenticatedRequest,
  ): Promise<MyUserResponseDTO> {
    const userId = request.user.id;
    const user = await UserRepo.findById(userId);
    return {
      myUser: mapUserToDTO(user),
    };
  }

  /**
   * Should be called after oauth2 sign in, creates or updates user.
   */
  @Security("api_key")
  @Post("/oauth2")
  public async oauth2SignIn(
    @Body() request: SignedInRequestDTO,
  ): Promise<SignedInResponseDTO> {
    let user = await UserRepo.create({
      name: request.name,
      email: request.email,
      authProvider: request.authProvider,
      authUserId: request.authUserId,
      picture: request.picture,
    });
    const token = JwtService.encode(user);
    return {
      jwt: token,
      user: mapUserToDTO(user),
    };
  }

  /**
   * Can be used to create a user manually, requires API KEY
   */
  @Security("api_key")
  @Post()
  public async createUser(@Body() request: CreateUserRequestDTO) {
    const user: DbUserInitializer = {
      name: request.name,
      email: request.email,
    };
    await UserRepo.create(user);
  }
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  picture: string | null;
  choosenMasterPlan: number | null;
  createdAt: Date;
}

export const mapUserToDTO = (user: DbUser): UserDTO => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    choosenMasterPlan: user.choosenMasterPlanId,
    createdAt: user.createdAt,
  };
};

interface UsersResponseDTO {
  users: UserDTO[];
}

interface CreateUserRequestDTO {
  /**
   * @minLength 3
   */
  name: string;

  /**
   * @pattern ^(.+)@(.+)$ please provide correct email
   */
  email: string;
}

interface SignedInRequestDTO {
  /**
   * @minLength 3
   */
  name: string;
  /**
   * @pattern ^(.+)@(.+)$ please provide correct email
   */
  email: string;
  authProvider: string;
  /**
   * @minLength 3
   */
  authUserId: string;

  picture: string | null;
}

interface SignedInResponseDTO {
  jwt: string;
  user: UserDTO;
}

interface MyUserResponseDTO {
  myUser: UserDTO;
}
