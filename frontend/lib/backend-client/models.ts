export type UserDTO = {
	id: number;
	name: string;
	email: string;
	createdAt: string;
};



export type UsersResponseDTO = {
	users: Array<UserDTO>;
};



export type MyUserResponseDTO = {
	myUser: UserDTO;
};



export type SignedInResponseDTO = {
	jwt: string;
};



export type SignedInRequestDTO = {
	name: string;
	email: string;
	authProvider: string;
	authUserId: string;
};



export type CreateUserRequestDTO = {
	name: string;
	email: string;
	authProvider: string | null;
	authUserId: string | null;
};

