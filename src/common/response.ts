import type { Context } from "hono"
import type { ContentfulStatusCode } from "hono/utils/http-status"

export function successResponse(c: Context, data: unknown, message = 'Success', status = 200 as ContentfulStatusCode) {
    return c.json({
        isSuccess: true,
        status: 'success',
        message,
        data,
    }, status)
}

export function errorResponse(c: Context, errorMessage = 'Something went wrong', status = 500 as ContentfulStatusCode, extra?: object) {
    return c.json({
        isSuccess: false,
        status: 'error',
        message: errorMessage,
        ...(extra || {})
    }, status)
}