import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { AppError } from '../common/error.js'

export const errorHandler = async (err: unknown, c: Context) => {
    if (err instanceof AppError) {
        return c.json(
            {
                status: 'error',
                isSuccess: false,
                message: err.message,
                data: null,
            },
            err.statusCode as ContentfulStatusCode
        )
    }

    if (err instanceof HTTPException) {
        const res = err.getResponse()
        return res
    }

    return c.json(
        {
            isSuccess: false,
            status: 'error',
            message: 'Internal Server Error',
            data: null,
        },
        500
    )
}
