import { Body, Controller, Get, Post, Route, Security, Request } from 'tsoa';
import userRepo from '@src/repos/UserRepo';
import User, { UserInitializer } from '@src/models/User';
import { AuthenticatedRequest } from '@src/authentication';

@Route('users')
export class UserController extends Controller {
  @Get()
  public async getUsers(): Promise<UsersResponseDTO> {
    const users = await userRepo.getAll();
    const UserDTOs = users.map(mapUserToDTO);
    return {
      users: UserDTOs,
    };
  }

  @Security('api_key')
  @Get('/me')
  public getMyUser(
    @Request() request: AuthenticatedRequest,
  ): MyUserResponseDTO {
    const user = request.user;
    return {
      myUser: mapUserToDTO(user),
    };
  }

  @Post()
  public async createUser(
    @Body() request: CreateUserRequestDTO,
  ) {
    const user: UserInitializer = {
      name: request.name,
      email: request.email,
    };
    await userRepo.create(user);
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
  name: string,
  email: string,
}

interface MyUserResponseDTO {
  myUser: UserDTO;
}