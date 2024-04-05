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
	authProvider: 'discord';
	authUserId: string;
};




export type CreateUserRequestDTO = {
	name: string;
	email: string;
	authProvider: 'discord' | null;
	authUserId: string | null;
};


