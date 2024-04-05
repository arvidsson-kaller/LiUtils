export const $UserDTO = {
	properties: {
		id: {
	type: 'number',
	isRequired: true,
	format: 'double',
},
		name: {
	type: 'string',
	isRequired: true,
},
		email: {
	type: 'string',
	isRequired: true,
},
		createdAt: {
	type: 'string',
	isRequired: true,
	format: 'date-time',
},
	},
} as const;

export const $UsersResponseDTO = {
	properties: {
		users: {
	type: 'array',
	contains: {
		type: 'UserDTO',
	},
	isRequired: true,
},
	},
} as const;

export const $MyUserResponseDTO = {
	properties: {
		myUser: {
	type: 'UserDTO',
	isRequired: true,
},
	},
} as const;

export const $SignedInResponseDTO = {
	properties: {
		jwt: {
	type: 'string',
	isRequired: true,
},
	},
} as const;

export const $SignedInRequestDTO = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
	minLength: 3,
},
		email: {
	type: 'string',
	isRequired: true,
	pattern: '^(.+)@(.+)$',
},
		authProvider: {
	type: 'string',
	isRequired: true,
},
		authUserId: {
	type: 'string',
	isRequired: true,
	minLength: 3,
},
	},
} as const;

export const $CreateUserRequestDTO = {
	properties: {
		name: {
	type: 'string',
	isRequired: true,
	minLength: 3,
},
		email: {
	type: 'string',
	isRequired: true,
	pattern: '^(.+)@(.+)$',
},
		authProvider: {
	type: 'string',
	isRequired: true,
	isNullable: true,
},
		authUserId: {
	type: 'string',
	isRequired: true,
	isNullable: true,
},
	},
} as const;