import type { Context, Next } from "hono"
import type { ContentfulStatusCode } from "hono/utils/http-status"
import { AppError } from "../common/error.js"
import { errorResponse } from "../common/response.js"

export async function errorHandler(c: Context, next: Next) {
    try {
        await next()
    } catch (err) {
        console.error('Error caught in middleware:', err)

        if (err instanceof AppError) {
            return errorResponse(c, err.message, err.statusCode as ContentfulStatusCode)
        }

        return errorResponse(c, 'Internal Server Error', 500)
    }
}