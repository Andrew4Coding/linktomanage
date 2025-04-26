export type authPayload = {
    id: string;
    email: string;
    name: string;
}

export type authenticatedRoute = {
    Variables: {
        user: authPayload
    }
}

export type filterParams = {
    page?: number;
    limit?: number;
    filters?: {
        [key: string]: string | number | boolean;
    }
}