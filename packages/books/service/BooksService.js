import {PrismaClient} from "@prisma/client";

class BooksService {
    db = new PrismaClient()

    async getAll() {
        return this.db.books.findMany({
            select: {
                title: true,
                authorId: false,
                Author: true,
                publicationDate: true,
                genres: {
                    select: {
                        booksId: false,
                        genresId: false,
                        Genres: true,
                        Books: false
                    }
                }
            }
        });
    }

    async getById(id) {
        return this.db.books.findFirst({
            where: {id: +id},
            select: {
                title: true,
                authorId: false,
                Author: true,
                publicationDate: true,
                genres: {
                    select: {
                        booksId: false,
                        genresId: false,
                        Genres: true,
                        Books: false
                    }
                }
            }
        });
    }

    async create(title, author, publicationDate, genres) {
        const book = await this.db.books.create({
            data: {
                title,
                authorId: +author,
                publicationDate,
            }
        })

        await this.db.booksToGenres.createMany({
            data: genres.map(genre => ({
                booksId: book.id,
                genresId: +genre
            }))
        })
        return this.getById(book.id)
    }

    async update(id, title, author, publicationDate, genres) {
        const book = await this.db.books.update({
            where: {id: +id},
            data: {
                title,
                authorId: +author,
                publicationDate,
            }
        })

        await this.db.booksToGenres.deleteMany({
            where: {booksId: book.id}
        })

        await this.db.booksToGenres.createMany({
            data: genres.map(genre => ({
                booksId: book.id,
                genresId: +genre
            }))
        })

        return this.getById(book.id)
    }

    async delete(id) {
        return this.db.books.delete({
            where: {id: +id}
        });
    }
}

export default new BooksService()