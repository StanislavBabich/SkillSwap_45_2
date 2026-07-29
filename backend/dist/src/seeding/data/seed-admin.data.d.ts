export interface SeedCreateAdmin {
    name: string;
    email: string;
    password: string;
}
export declare const getAdminData: () => SeedCreateAdmin;
