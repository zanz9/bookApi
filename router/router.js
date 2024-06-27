import {Router} from 'express'
import authRouter from "./nested/auth.js";
import booksRouter from "./nested/books.js";

const router = Router()

router.use('/users', authRouter)
router.use('/books', booksRouter)

export default router