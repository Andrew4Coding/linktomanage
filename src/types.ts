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