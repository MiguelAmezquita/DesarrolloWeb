export interface IUser {
    id: number,
    name: string,
    lastName: string,
    location: string,
    email: string,
    password: string | null,
    rePassword: string | null,
    image: string | null,
    token: string,
}