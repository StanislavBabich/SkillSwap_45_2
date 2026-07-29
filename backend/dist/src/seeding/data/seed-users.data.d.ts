import { UserGender } from '../../users/user.enums';
export interface SeedCreateUser {
    name: string;
    email: string;
    password: string;
    about?: string;
    birthdate?: string;
    city?: string;
    gender?: UserGender;
}
export declare const UsersData: SeedCreateUser[];
