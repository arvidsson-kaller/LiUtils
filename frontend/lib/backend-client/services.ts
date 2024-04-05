import type { CancelablePromise } from './core/CancelablePromise';
import type { BaseHttpRequest } from './core/BaseHttpRequest';

import type { CreateUserRequestDTO,MyUserResponseDTO,SignedInRequestDTO,SignedInResponseDTO,UsersResponseDTO } from './models';

export type DefaultData = {
        CreateUser: {
                    requestBody: CreateUserRequestDTO
                    
                };
Oauth2SignIn: {
                    requestBody: SignedInRequestDTO
                    
                };
    }

export class DefaultService {

	constructor(public readonly httpRequest: BaseHttpRequest) {}

	/**
	 * @returns UsersResponseDTO Ok
	 * @throws ApiError
	 */
	public getUsers(): CancelablePromise<UsersResponseDTO> {
				return this.httpRequest.request({
			method: 'GET',
			url: '/users',
		});
	}

	/**
	 * Can be used to create a user manually, requires API KEY
	 * @returns void No content
	 * @throws ApiError
	 */
	public createUser(data: DefaultData['CreateUser']): CancelablePromise<void> {
		const {
requestBody,
} = data;
		return this.httpRequest.request({
			method: 'POST',
			url: '/users',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

	/**
	 * @returns MyUserResponseDTO Ok
	 * @throws ApiError
	 */
	public getMyUser(): CancelablePromise<MyUserResponseDTO> {
				return this.httpRequest.request({
			method: 'GET',
			url: '/users/me',
		});
	}

	/**
	 * Should be called after oauth2 sign in, creates or updates user.
	 * @returns SignedInResponseDTO Ok
	 * @throws ApiError
	 */
	public oauth2SignIn(data: DefaultData['Oauth2SignIn']): CancelablePromise<SignedInResponseDTO> {
		const {
requestBody,
} = data;
		return this.httpRequest.request({
			method: 'POST',
			url: '/users/oauth2',
			body: requestBody,
			mediaType: 'application/json',
		});
	}

}