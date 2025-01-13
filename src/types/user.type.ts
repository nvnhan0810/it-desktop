export type TokenResponse = {
    access_token: string;
    refresh_token: string;
}

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}