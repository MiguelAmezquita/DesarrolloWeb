export interface IUser {
    id: number,
    name: string,
    lastName: string,
    email: string,
    password: string | null,
    image: string | null,
    token: string,
}