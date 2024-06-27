export default class UserDto {
    id
    email
    role
    isVerified

    constructor(user) {
        this.id = user.id
        this.email = user.email
        this.role = user.role
        this.isVerified = user.isVerified
    }
}

