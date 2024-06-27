import BooksService from "../service/BooksService.js";
import {validationResult} from "express-validator";
import ApiError from "../../../exceptions/ApiError.js";

class BooksController {
    async getAll(req, res, next){
        try{
            const books = await BooksService.getAll()
            res.json(books)
        }
        catch(e){
            next(e)
        }
    }

    async getById(req, res, next){
        try{
            const {id} = req.params
            const book = await BooksService.getById(id)
            res.json(book)
        }
        catch(e){
            next(e)
        }
    }

    async create(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Неправильно переданы данные', errors.array()))

            const {title, author, publicationDate, genres} = req.body
            // title: String, author: Int, publicationDate: DateTime, genres: Int[]
            const book = await BooksService.create(title, author, publicationDate, genres)
            res.json(book)
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next){
        try{
            const errors = validationResult(req)
            if (!errors.isEmpty()) return next(ApiError.BadRequest('Неправильно переданы данные', errors.array()))

            const {id} = req.params
            const {title, author, publicationDate, genres} = req.body
            const book = await BooksService.update(id, title, author, publicationDate, genres)
            res.json(book)
        }
        catch(e){
            next(e)
        }
    }

    async delete(req, res, next){
        try{
            const {id} = req.params
            const book = await BooksService.delete(id)
            res.json(book)
        }
        catch(e){
            next(e)
        }
    }
}

export default new BooksController()