import { UserGender } from '../user.enums';
export declare class UpdateProfileDto {
    name?: string;
    about?: string;
    birthdate?: string;
    city?: string;
    gender?: UserGender;
    avatar?: string;
    wantToLearn?: string[];
}
