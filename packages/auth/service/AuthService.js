import {PrismaClient} from "@prisma/client";
import bcrypt from 'bcrypt'
import TokenService from "./TokenService.js";
import ApiError from "../../../exceptions/ApiError.js";
import UserDto from "../../../dto/UserDto.js";

class AuthService {
    prisma = new PrismaClient()
    userDB = this.prisma.users

    async register(email, password, username) {
        const candidate = await this.userDB.findFirst({where: {email}})
        if (candidate) throw ApiError.BadRequest(`Пользователь с почтовый адресом ${email} уже существует`)

        const hashPassword = await bcrypt.hash(password, 3)
        const user = await this.userDB.create({data: {email, password: hashPassword, username}})

        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async login(username, password) {
        const user = await this.userDB.findFirst({where: {username}})
        if (!user) throw ApiError.BadRequest('Непральные данные для входа')

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) throw ApiError.BadRequest('Непральные данные для входа')

        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({...userDto})
        await TokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const userData = await TokenService.removeToken(refreshToken)
        return new UserDto(userData)
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()
        return await TokenService.refreshToken(refreshToken)
    }

    async getMe(id) {
        const user = await this.userDB.findFirst({where: {id: +id}})
        return new UserDto(user)
    }

    async changeRole(id, role) {
        console.log(id, role)
        const user = await this.userDB.update({where: {id: +id}, data: {role: +role}})
        return new UserDto(user)
    }

    async verifyEmail(token) {
        const user = await this.userDB.update({where: {verifyUrl: token}, data: {isVerified: true}})
        return new UserDto(user)
    }
}

export default new AuthService()