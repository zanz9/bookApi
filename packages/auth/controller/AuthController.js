import {validationResult} from "express-validator";
import ApiError from "../../../exceptions/ApiError.js";
import AuthService from "../service/AuthService.js";
import MailService from "../service/MailService.js";

class AuthController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Неправильно переданы данные', errors.array()))

            const {email, password, username} = req.body
            const userData = await AuthService.register(email, password, username)

            await MailService.sendVerifyMail(email)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(200).json({...userData, message: 'Регистрация прошла успешно'})
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Неправильно переданы данные', errors.array()))

            const {username, password} = req.body
            const userData = await AuthService.login(username, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(200).json({...userData, message: 'Авторизация прошла успешно'})
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await AuthService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.status(200).json({...userData, message: "Вы успешно вышли"})
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await AuthService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getMe(req, res, next) {
        try {
            const userData = await AuthService.getMe(req.user.id)
            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async changeRole(req, res, next){
        try {
            const {id} = req.params
            const {role} = req.body
            // 1 - USER
            // 2 - ADMIN
            const userData = await AuthService.changeRole(+id, role)
            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async verifyEmail(req, res, next){
        try {
            console.log(req)
            const {token} = req.query
            const userData = await AuthService.verifyEmail(token)
            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }
}

export default new AuthController()