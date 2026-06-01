import { generateToken } from "../utils/jwt-util"

export interface UserJWTPayload {
    id: number
    name: string
    email: string
    role: string
}

export interface RegisterUserRequest {
    name: string
    email: string
    password: string
}

export interface LoginUserRequest {
    email: string
    password: string
}

export interface UserResponse {
    token?: string
}

export interface GetUserResponse {
    id: number
    name: string
    email: string
    role: string
    createdAt: Date
    updatedAt: Date
}

export function toUserResponse(
    id: number,
    name: string,
    email: string,
    role: string
): UserResponse {
    return {
        token: generateToken(
            {
                id: id,
                name: name,
                email: email,
                role: role,
            },
            "1h"
        ),
    }
}