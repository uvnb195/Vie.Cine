import { Address } from ".";

export interface UserInfo {
    email: string;
    emailVerified: boolean;
    displayName: string | null;
    photoURL: string | null;
    phoneNumber: string | null;
    address: {
        province?: Address<'Province'>,
        district?: Address<'District'>,
        ward?: Address<'Ward'>,
    } | null;
    birthday: string | null;
    gender: 1 | 2 | null;
    readonly role?: 'admin' | undefined;
}
