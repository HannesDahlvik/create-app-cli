console.clear()

import express, { NextFunction, Request, Response } from 'express'
import { HttpException } from './types'
import InitiateMongoServer from './db'

// Middleware
import cors from 'cors'

// Utils
import dotenv from 'dotenv'
import colors from 'colors'
import logger from './utils/logger'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

// MongoDB configuration
InitiateMongoServer(process.env.MONGO_USER, process.env.MONGO_PASSWORD, process.env.MONGO_PATH)
    .then(() => {
        logger('server', 'Connected to the mongodb database')
        app.listen(PORT, () => logger('server', `Server is running on port ${PORT}`))
    })
    .catch((err) => logger('error', err))

// Server configuration
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

/**
 * Routes
 */
app.get('*', (req, res, next) => {
    logger('server', `${colors.green(req.method)} - ${colors.cyan(req.originalUrl)}`)
    next()
})

// Error handling.
app.use((error: HttpException, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500
    const message = error.message || 'Something went wrong'
    res
        .status(status)
        .send({
            status,
            message
        })

})