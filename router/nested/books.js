import {Router} from "express";
import BooksController from "../../packages/books/controller/BooksController.js";
import {body} from "express-validator";
import adminMiddleware from "../../packages/auth/middleware/adminMiddleware.js";

const booksRouter = Router()

booksRouter.get('/', BooksController.getAll)
booksRouter.get('/:id', BooksController.getById)
booksRouter.post('/',
    ...[
        body('title', 'Название книги не может быть пустым').notEmpty().isString(),
        body('author', 'Автор книги не может быть пустым').notEmpty().isInt(),
        body('publicationDate', 'Дата публикации книги не может быть пустым').notEmpty().isISO8601(),
        body('genres', 'Жанры книги не может быть пустым').notEmpty().isArray()
    ],
    adminMiddleware,
    BooksController.create)

booksRouter.put('/:id',
    ...[
        body('title', 'Название книги не может быть пустым').notEmpty().isString(),
        body('author', 'Автор книги не может быть пустым').notEmpty().isInt(),
        body('publicationDate', 'Дата публикации книги не может быть пустым').notEmpty().isISO8601(),
        body('genres', 'Жанры книги не может быть пустым').notEmpty().isArray()
    ],
    adminMiddleware,
    BooksController.update)
booksRouter.delete('/:id', adminMiddleware, BooksController.delete)


export default booksRouter