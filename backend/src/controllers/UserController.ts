import { Body, Controller, Get, Post, Route, Security, Request } from 'tsoa';
import User, { UserInitializer } from '@src/models/User';
import { AuthenticatedRequest } from '@src/authentication';
import JwtService from '@src/services/JwtService';
import UserRepo from '@src/repos/UserRepo';

@Route('users')
export class UserController extends Controller {
  @Security('jwt')
  @Get()
  public async getUsers(): Promise<UsersResponseDTO> {
    const users = await UserRepo.getAll();
    const UserDTOs = users.map(mapUserToDTO);
    return {
      users: UserDTOs,
    };
  }

  @Security('jwt')
  @Get('/me')
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
  @Security('api_key')
  @Post('/oauth2')
  public async oauth2SignIn(
    @Body() request: SignedInRequestDTO,
  ): Promise<SignedInResponseDTO> {
    const {authProvider, authUserId} = request;
    let user = await UserRepo.findByOAuth(authProvider, authUserId);
    if (user == null) {
      user = await UserRepo.create({
        name: request.name,
        email: request.email,
        authProvider: request.authProvider,
        authUserId: request.authUserId,
      });
    }
    const token = JwtService.encode(user);
    return {
      jwt: token,
    };
  }

  /**
   * Can be used to create a user manually, requires API KEY
   */
  @Security('api_key')
  @Post()
  public async createUser(
    @Body() request: CreateUserRequestDTO,
  ) {
    const user: UserInitializer = {
      name: request.name,
      email: request.email,
      authProvider: request.authProvider,
      authUserId: request.authUserId,
    };
    await UserRepo.create(user);
  }
}

interface UserDTO {
  id: number;
  name: string;
  email: string,
  createdAt: Date;
}

export const mapUserToDTO = (user: User): UserDTO => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
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
  name: string,

  /**
   * @pattern ^(.+)@(.+)$ please provide correct email
   */
  email: string,

  authProvider: string | null,
  authUserId: string | null
}

interface SignedInRequestDTO {
  /**
   * @minLength 3
  */
  name: string,
  /**
   * @pattern ^(.+)@(.+)$ please provide correct email
   */
  email: string,
  authProvider: string,
  /**
   * @minLength 3
  */
  authUserId: string
}

interface SignedInResponseDTO {
  jwt: string
}

interface MyUserResponseDTO {
  myUser: UserDTO;
}