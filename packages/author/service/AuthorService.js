import {PrismaClient} from "@prisma/client";

class AuthorService {
    db = new PrismaClient()
    async create(firstName, lastName) {
        return this.db.authors.create({
            data: {
                firstName,
                lastName
            }
        });
    }
}

export default new AuthorService()