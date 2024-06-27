import {Router} from "express";
import {body} from "express-validator";
import AuthController from "../../packages/auth/controller/AuthController.js";
import authMiddleware from "../../packages/auth/middleware/authMiddleware.js";
import adminMiddleware from "../../packages/auth/middleware/adminMiddleware.js";

const authRouter = Router()
authRouter.post('/register',
    ...[
        body('email').isEmail(),
        body('username').isString(),
        body('password').isLength({min: 8, max: 32}),
    ],
    AuthController.register
)
authRouter.post('/login',
    ...[
        body('username').isString(),
        body('password').isLength({min: 8, max: 32}),
    ],
    AuthController.login)
authRouter.get('/me', authMiddleware, AuthController.getMe)
authRouter.get('/verify-email', AuthController.verifyEmail)


authRouter.get('/logout', AuthController.logout)
authRouter.get('/refresh', AuthController.refresh)
authRouter.put('/:id/role', adminMiddleware, AuthController.changeRole)

export default authRouter