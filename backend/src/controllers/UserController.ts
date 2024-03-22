import { Body, Controller, Get, Post, Route } from 'tsoa';
import userRepo from '@src/repos/UserRepo'
import Users, { UsersInitializer } from '@src/models/Users';

export default interface UserDTO {
  id: number;
  name: string;
  createdAt: Date;
}

export const mapUserToDTO = (user: Users): UserDTO => {
  return {
    id: user.id,
    name: user.name,
    createdAt: user.createdAt
  };
}

interface UsersResponseDTO {
  users: UserDTO[];
}

interface CreateUserRequestDTO {
  name: string
}

@Route('users')
export class UserController extends Controller {
  @Get()
  public async getMessage(): Promise<UsersResponseDTO> {
    const users = await userRepo.getAll();
    const UserDTOs = users.map(mapUserToDTO);
    return {
      users: UserDTOs
    }
  }

  @Post()
  public async createUser(
    @Body() request: CreateUserRequestDTO
  ) {
    const user: UsersInitializer = {
      name: request.name
    };
    await userRepo.create(user);
  }
}
