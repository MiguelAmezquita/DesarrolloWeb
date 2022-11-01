export interface IUser {
    id: string,
    name: string,
    lastName: string,
    email: string,
    password: string | null,
    rePassword: string | null,
    image: string | null,
    token: string,
}