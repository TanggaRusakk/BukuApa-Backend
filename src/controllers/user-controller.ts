import { Response, NextFunction } from "express"
import {
    LoginUserRequest,
    RegisterUserRequest,
    UserResponse,
} from "../models/user-model"
import { UserRequest } from "../models/user-request-model"
import { UserService } from "../services/user-service"

export class UserController {
    static async register(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: RegisterUserRequest = req.body as RegisterUserRequest
            const response: UserResponse = await UserService.register(request)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest
            const response: UserResponse = await UserService.login(request)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.get(req.user!)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }
}