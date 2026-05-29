import express from 'express'
import { PORT } from './utils/env-util'
import { publicRouter } from './routes/public-api'
import { errorMiddleware } from './middlewares/error-middleware'
import { privateRouter } from './routes/private-api'
import { prismaClient } from './utils/database-util'

const app = express()

app.use(express.json())
app.use("/api", publicRouter)
app.use("/api", privateRouter)
app.use(errorMiddleware)

app.listen(PORT || 3000, async () => {
    console.log(`Server running on port ${PORT}`)
    try {
        await prismaClient.$connect()
        console.log('Database connected successfully')
    } catch (error) {
        console.error('Failed to connect to database:', error)
        process.exit(1)
    }
})